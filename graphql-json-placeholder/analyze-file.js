const fs = require('fs');
const path = require('path');

const types = ['user', 'comment', 'photo', 'post', 'todo', 'album'];
const defaultTypes = ['String', 'ID', 'Int', 'Float', 'Boolean'];
const idFieldName = 'id';
const capitalizedIdFieldName = idFieldName.substr(0, 1).toUpperCase() + idFieldName.substr(1);
const mandatoryPropertiesCount = 2;

const mapType = (obj, objName, parentName) => {
    const name = parentName ? `${parentName}.${objName}` : objName;
    if (obj === null) {
        return [{
            name: name,
            optional: true
        }];
    }
    if (Array.isArray(obj)) {
        const mappedType = mapType(obj[0], objName, parentName);
        return [{
            name: name,
            type: `[${mappedType[0].type}]`
        }];
    }

    if (typeof obj === 'object') {
        return Object
            .keys(obj)
            .map(k => mapType(obj[k], k, name))
            .reduce((a, c) => a.concat(c), []);
    } else if (typeof obj === 'boolean') {
        return [{
            name: name,
            type: 'Boolean'
        }];
    } else if (typeof obj === 'string' && isNaN(+obj)) {
        if (/[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]/gi.test(obj)) {
            return [{
                name: name,
                type: 'Date'
            }];
        }
        return [{
            name: name,
            type: 'String'
        }];
    } else if (typeof obj === 'number' || !isNaN(+obj)) {
        const regex = new RegExp(idFieldName + '$', 'i');
        if (regex.test(objName)) {
            return [{
                name: name,
                type: 'ID'
            }];
        }
        return [{
            name: name,
            type: obj === Math.floor(+obj) ? 'Int' : 'Float'
        }];
    }
}

const getTypes = (returnObject, globalCount) => {
    const keys = Object.keys(returnObject);

    let mandatoryCurrentCount = mandatoryPropertiesCount;
    const subTypes = keys.reduce((aggregated, current) => {
        const currentSplit = current.split('.');
        const level = currentSplit.length - 1;
        const idRegex = new RegExp('\.id|[a-zA-Z]+Id$');
        let objectNameCapitalized = currentSplit[currentSplit.length - 2];
        objectNameCapitalized = `${objectNameCapitalized.substr(0, 1).toUpperCase()}${objectNameCapitalized.substr(1)}`;

        if (!aggregated[objectNameCapitalized]) {
            aggregated[objectNameCapitalized] = {
                __level: level
            };
        }
        let type = returnObject[current].type;
        // we only get the 'mandatoryPropertiesCount' first properties
        if (level == 1) {
            if (mandatoryCurrentCount > 0 && returnObject[current].count === globalCount && !idRegex.test(current)) {
                type = type + '!';
                mandatoryCurrentCount--;
            }
            else if (idRegex.test(current)) {
                type = type + '!';
            }
        }
        aggregated[objectNameCapitalized][currentSplit[currentSplit.length - 1]] = type;
        if (level > 1) {
            let objectNameCapitalizedParent = currentSplit[currentSplit.length - 3];
            objectNameCapitalizedParent = `${objectNameCapitalizedParent.substr(0, 1).toUpperCase()}${objectNameCapitalizedParent.substr(1)}`;
            aggregated[objectNameCapitalizedParent][objectNameCapitalized.toLowerCase()] = `${objectNameCapitalized}${type.includes('!') ? '!' : ''}`;
        }
        return aggregated;
    }, {});
    return subTypes
}

const check = async () => {
    let typesFromObjects = {};
    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        await new Promise((resolve) => {
            fs.readFile(path.resolve(__dirname, `./data/${type}s.json`), (err, data) => {
                if (err) {
                    throw err;
                }
                const dataParsed = JSON.parse(data.toString('ascii'));
                const mappedForType = dataParsed.map(x => mapType(x, type, null));

                const returnObject = {};
                for (let i = 0; i < mappedForType.length; i++) {
                    const element = mappedForType[i];
                    for (let j = 0; j < element.length; j++) {
                        const elementProp = element[j];
                        if (returnObject[elementProp.name]) {
                            returnObject[elementProp.name].count++;
                            if (elementProp.optional) {
                                returnObject[elementProp.name].optional = true;
                            }
                            if (elementProp.type === 'Float' && returnObject[elementProp.name].type == 'ID') {
                                returnObject[elementProp.name].type = 'Float';
                            }
                        } else {
                            returnObject[elementProp.name] = {
                                ...elementProp,
                                count: 1
                            };
                        }
                    }
                }
                typesFromObjects = {
                    ...typesFromObjects,
                    ...getTypes(returnObject, dataParsed.length)
                }
                resolve();
            })
        });
    }
    

    // replace the objects under the format <something>Id with the something for mutations
    const typeKeys = Object.keys(typesFromObjects);
    for (let i = 0; i < typeKeys.length; i++) {
        const key = typeKeys[i];
        const regex = new RegExp(`[a-z]+${capitalizedIdFieldName}$`);
        
        const typeSubKeysWithProperTypes = Object
            .keys(typesFromObjects[key])
            .filter(key => regex.test(key));
        if (typeSubKeysWithProperTypes.length > 0) {
            for (let j = 0; j < typeSubKeysWithProperTypes.length; j++) {
                const subKey = typeSubKeysWithProperTypes[j];
                const type = subKey.substr(0, 1).toUpperCase() + subKey.substr(1, subKey.length - 3);
                const isToReplace = typeKeys.indexOf(type) > -1;
                if (isToReplace) {
                    delete typesFromObjects[key][subKey];
                    typesFromObjects[key][`mutation_${subKey}`] = 'ID!';
                    typesFromObjects[key][`query_${type.toLowerCase()}`] = type + '!';
                }
            }
        }
    }
    
    let typesAsWeWantIt = typeKeys
        .map(type => {
            const properties = Object.keys(typesFromObjects[type])
            const propertiesAsString = properties
                .filter(property => property.indexOf('__') === -1)
                // we remove the mutation fields
                .filter(property => property.indexOf('mutation_') === -1)
                .map(property => `\t${property.replace('query_', '')}: ${typesFromObjects[type][property]}`).join('\n');
            return `type ${type} {\n${propertiesAsString}\n}`;
        }).join('\n');
    
    // paginated types for get arrays
    typesAsWeWantIt += '\n' + typeKeys
        .filter(type => typesFromObjects[type].__level === 1)
        .map(type => {
            return `type ${type}Paginated {\n\ttotalCount: Int, \n\t${type.toLowerCase()}s: [${type}]!\n}`;
        }).join('\n');
    
    // input types for inputs
    typesAsWeWantIt += '\n' + typeKeys
        .filter(type => typesFromObjects[type].__level > 1)
        .map(type => {
            const properties = Object.keys(typesFromObjects[type])
            const propertiesAsString = properties
                .filter(property => property.indexOf('__') === -1)
                // we remove the query fields
                .filter(property => property.indexOf('query_') === -1)
                .map(property => {
                    const regexResult = /[a-z]+/gi.exec(typesFromObjects[type][property]);
                    if (regexResult && defaultTypes.indexOf(regexResult[0]) === -1) {
                        return `\t${property.replace('mutation_', '')}: ${typesFromObjects[type][property].replace(regexResult[0], `${regexResult[0]}Input`)}`;
                    }
                    return `\t${property.replace('mutation_', '')}: ${typesFromObjects[type][property]}`;
                }).join('\n');
            return `input ${type}Input {\n${propertiesAsString}\n}`;
        }).join('\n');

    const queriesAsWeWantIt = `type Query {\n` + typeKeys
        .filter(type => typesFromObjects[type].__level === 1)
        .map(type => {
            const properties = Object.keys(typesFromObjects[type]);
            const queryPropertiesAsArray = properties
                .filter(property => property.indexOf('__') === -1)
                // we get only the query fields
                .filter(property => property.indexOf('query_') === 0);
                
            const queries = [
                {
                    operationName: `get${type}s`,
                    arguments: [{ name: 'first', type: 'Int' }, { name: 'after', type: 'Int' }, ...queryPropertiesAsArray.map(prop => ({name: prop.replace('query_', '') + capitalizedIdFieldName, type: 'ID'}))],
                    returnType: `${type}Paginated`
                },
                {
                    operationName: `get${type}`,
                    arguments: [{ name: idFieldName, type: 'ID!' }],
                    returnType: `${type}`
                },
            ];
            return queries.map(operation => {
                return `\t${operation.operationName}${
                    operation.arguments.length === 0 ? '' : `(${operation.arguments.map(argument => `${argument.name}: ${argument.type}`)})`
                    }: ${operation.returnType}`;
            }).join('\n')
        }).join('\n\n') + `\n}`;

    const queriesForResolverAsWeWantIt = `\tQuery: {\n` + typeKeys
        .filter(type => typesFromObjects[type].__level === 1)
        .map(type => {
            const properties = Object.keys(typesFromObjects[type]);
            const queryPropertiesAsArray = properties
                .filter(property => property.indexOf('__') === -1)
                // we get only the query fields
                .filter(property => property.indexOf('query_') === 0);                
            
            return [
                `\t\tget${type}s: (parent, {first = 100, after = 0${queryPropertiesAsArray.length === 0 ? '' : ', ' + queryPropertiesAsArray.map(prop => prop.replace('query_', '') + capitalizedIdFieldName).join(', ')}}, context, info) => {
                    ${
                        // intergerify the IDs
                        queryPropertiesAsArray.length === 0 ? '' : queryPropertiesAsArray.map(prop => prop.replace('query_', '') + capitalizedIdFieldName + ' = +' + prop.replace('query_', '') + capitalizedIdFieldName + ';').join('\n')
                    }
                    return {
                        totalCount: _${type.toLowerCase()}s${queryPropertiesAsArray.length === 0 ? '' : `\n.filter(item => ${
                            queryPropertiesAsArray.map(prop => {
                                const itemName = prop
                                    .replace('query_', '');
                                return `item.${itemName}${capitalizedIdFieldName} === (${itemName}${capitalizedIdFieldName} || item.${itemName}${capitalizedIdFieldName})`;
                            }).join(' && ')
                        })`}.length,
                        ${type.toLowerCase()}s: _${type.toLowerCase()}s${queryPropertiesAsArray.length === 0 ? '' : `\n.filter(item => ${
                                queryPropertiesAsArray.map(prop => {
                                    const itemName = prop
                                        .replace('query_', '');
                                    return `item.${itemName}${capitalizedIdFieldName} === (${itemName}${capitalizedIdFieldName} || item.${itemName}${capitalizedIdFieldName})`;
                                }).join(' && ')
                            })`}.slice(after, first)${
                                // if we have query properties, then we have to get the sub objects
                                queryPropertiesAsArray.length === 0 ? '' : `.map(item => {
                                return {...item, ${
                                    queryPropertiesAsArray
                                        .map(prop => {
                                            const itemName = prop
                                                .replace('query_', '');
                                            return `${itemName}: _${itemName}s.find(({${idFieldName}}) => ${idFieldName} === item.${itemName}${capitalizedIdFieldName})`;
                                        })}
                                    };
                                })`
                        }
                    };
                }`,
                `\t\tget${type}: (parent, {${idFieldName}}, context, info) => { ${idFieldName} = +${idFieldName}; return _${type.toLowerCase()}s.find(item => item.${idFieldName} === ${idFieldName}); }`,
            ].join(',\n')
        }).join(',\n') + `\n\t}`;

    const mutationsAsWeWantIt = `type Mutation {\n` + typeKeys
        .filter(type => typesFromObjects[type].__level === 1)
        .map(type => {
            const properties = Object.keys(typesFromObjects[type]);
            const propertiesAsArray = properties
                .filter(property => property.indexOf('__') === -1)
                // we remove the query fields
                .filter(property => property.indexOf('query_') === -1)
                .map(property => ({ name: property.replace('mutation_', ''), type: typesFromObjects[type][property] }));

            const mutations = [
                {
                    operationName: `update${type}`,
                    arguments: propertiesAsArray,
                    returnType: `${type}!`
                },
                {
                    operationName: `delete${type}`,
                    arguments: [{ name: idFieldName, type: 'ID!' }],
                    returnType: `${type}!`
                },
                {
                    operationName: `insert${type}`,
                    arguments: propertiesAsArray.filter(property => property.name !== idFieldName),
                    returnType: `${type}!`
                },
            ];
            return mutations.map(operation => {
                return `\t${operation.operationName}${
                    operation.arguments.length === 0 ? '' : `(${operation.arguments.map(argument => {
                        const regexResult = /[a-z]+/gi.exec(argument.type);
                        if (regexResult && defaultTypes.indexOf(regexResult[0]) === -1) {
                            return `\t${argument.name}: ${argument.type.replace(regexResult[0], `${regexResult[0]}Input`)}`;
                        }
                        return `${argument.name}: ${argument.type}`
                    }).join(', ')})`
                    }: ${operation.returnType}`;
            }).join('\n')
        }).join('\n\n') + `\n}`;

    const mutationsForResolverAsWeWantIt = `\tMutation: {\n` + Object
        .keys(typesFromObjects)
        .filter(type => typesFromObjects[type].__level === 1)
        .map(type => {
            const properties = Object.keys(typesFromObjects[type]);
            const propertiesAsArray = properties
                .filter(property => property.indexOf('__') === -1)
                // we remove the query fields
                .filter(property => property.indexOf('query_') === -1)
                .map(property => ({ name: property.replace('mutation_', ''), type: typesFromObjects[type][property] }));
            const mutationPropertiesAsArray = properties
                .filter(property => property.indexOf('__') === -1)
                // we get only the query fields
                .filter(property => property.indexOf('mutation_') === 0);   

            return [
                `\t\tupdate${type}: (parent, {${propertiesAsArray.map(x => x.name).join(', ')}}, context, info) => {
                    ${idFieldName} = +${idFieldName};
                    ${
                        propertiesAsArray
                        .filter(property => /\!$/.test(property.type))
                        .map(property => `if (!${property.name}) throw 'Missing property ${property.name}';`).join('\n')
                    }
                    ${
                        // intergerify the IDs
                        mutationPropertiesAsArray.length === 0 ? '' : mutationPropertiesAsArray.map(prop => prop.replace('mutation_', '') + ' = +' + prop.replace('mutation_', '') + ';').join('\n')
                    }
                    const _item = _${type.toLowerCase()}s.find(_item => _item.${idFieldName} === ${idFieldName});
                    if (_item) {
                        ${propertiesAsArray.map((x, i) => `${i ? `\t\t\t` : ``}_item.${x.name} = ${x.name}`).join(';\n')};
                    }
                    return _item;
                }`,
                `\t\tdelete${type}: (parent, {${idFieldName}}, context, info) => {
                        if (!id) throw 'Missing property id';
                        ${idFieldName} = +${idFieldName};
                    const itemIndex = _${type.toLowerCase()}s.findIndex(_item => _item.${idFieldName} === ${idFieldName});
                    if (itemIndex > -1) {
                        return _${type.toLowerCase()}s.splice(itemIndex, 1)[0];
                    }
                    return null;
                }`,
                `\t\tinsert${type}: (parent, {${propertiesAsArray.filter(property => property.name !== idFieldName).map(x => x.name).join(', ')}}, context, info) => {
                    ${
                        propertiesAsArray
                        .filter(property => property.name !== idFieldName)
                        .filter(property => /\!$/.test(property.type))
                        .map(property => `if (!${property.name}) throw 'Missing property ${property.name}';`).join('\n')
                    }
                    ${
                        // intergerify the IDs
                        mutationPropertiesAsArray.length === 0 ? '' : mutationPropertiesAsArray.map(prop => prop.replace('mutation_', '') + ' = +' + prop.replace('mutation_', '') + ';').join('\n')
                    }
                    const _item = {};
                    ${propertiesAsArray.filter(property => property.name !== idFieldName).map((x, i) => `${i ? `\t\t\t` : ``}_item.${x.name} = ${x.name}`).join(';\n')}
                    __ids['${type.toLowerCase()}']++;
                    _item.${idFieldName} = __ids['${type.toLowerCase()}'];
                    _${type.toLowerCase()}s.push(_item);
                    console.log(_item);
                    return _item;
                }`,
            ].join(',\n')
        }).join(',\n\n') + `\n\t}`;

    const resolvers = `
const fs = require('fs');
const path = require('path');

${
    Object
    .keys(typesFromObjects)
    .filter(type => typesFromObjects[type].__level === 1)
    .map(type => `const _${type.toLowerCase()}s = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/${type.toLowerCase()}s.json')).toString('ascii'));`)
    .join('\n')
}

// object to represent the IDs used for a type
const __ids = {};
${
    Object
        .keys(typesFromObjects)
        .filter(type => typesFromObjects[type].__level === 1)
        .map(type => `__ids['${type.toLowerCase()}'] = _${type.toLowerCase()}s.reduce((agg, curr) => Math.max(agg, curr.${idFieldName}), 0);`)
        .join('\n')
}

const resolvers = {
${queriesForResolverAsWeWantIt},
${mutationsForResolverAsWeWantIt},
};
export default resolvers;
    `;
    await new Promise(resolve => fs.writeFile(path.resolve(__dirname, './src/schema.graphql'), typesAsWeWantIt + '\n\n' + queriesAsWeWantIt + '\n\n' + mutationsAsWeWantIt, resolve));
    await new Promise(resolve => fs.writeFile(path.resolve(__dirname, './src/resolvers.js'), resolvers, resolve));
}

check();