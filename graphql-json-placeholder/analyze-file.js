const fs = require('fs');
const path = require('path');
const types = ['user', 'comment', 'photo', 'post', 'todo'];

const mapType = (obj, objName, parentName) => {
    const name = parentName ? `${parentName}.${objName}` : objName;
    if (obj === null) {
        return [{
            name: name,
            optional: true
        }];
    }
    if (Array.isArray(obj)) {
        console.log('array');
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
        if (/id$/i.test(objName)) {
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

    const subTypes = keys.reduce((aggregated, current) => {
        const currentSplit = current.split('.');
        const level = currentSplit.length - 1;
        let objectNameCapitalized = currentSplit[currentSplit.length - 2];
        objectNameCapitalized = `${objectNameCapitalized.substr(0, 1).toUpperCase()}${objectNameCapitalized.substr(1)}`;

        if (!aggregated[objectNameCapitalized]) {
            aggregated[objectNameCapitalized] = {
                __level: level
            };
        }
        let type = returnObject[current].type;
        if (returnObject[current].count === globalCount) {
            type = type + '!';
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

    let typesAsWeWantIt = Object
        .keys(typesFromObjects)
        .map(type => {
            const properties = Object.keys(typesFromObjects[type])
            const propertiesAsString = properties
                .filter(property => property.indexOf('__') === -1)
                .map(property => `\t${property}: ${typesFromObjects[type][property]}`).join('\n');
            return `type ${type} {\n${propertiesAsString}\n}`;
        }).join('\n');
    typesAsWeWantIt += '\n' + Object
        .keys(typesFromObjects)
        .filter(type => typesFromObjects[type].__level === 1)
        .map(type => {
            return `type ${type}Paginated {\n\ttotalCount: Int, \n\t${type.toLowerCase()}s: [${type}]!\n}`;
        }).join('\n');

    const queriesAsWeWantIt = `type Query {\n` + Object
        .keys(typesFromObjects)
        .filter(type => typesFromObjects[type].__level === 1)
        .map(type => {
            const queries = [
                {
                    operationName: `get${type}s`,
                    arguments: [{ name: 'first', type: 'Int' }, { name: 'after', type: 'Int' }],
                    returnType: `${type}Paginated`
                },
                {
                    operationName: `get${type}`,
                    arguments: [{ name: 'id', type: 'ID!' }],
                    returnType: `${type}`
                },
            ];
            return queries.map(operation => {

                return `\t${operation.operationName}${
                    operation.arguments.length === 0 ? '' : `(${operation.arguments.map(argument => `${argument.name}: ${argument.type}`)})`
                    }: ${operation.returnType}`;
            }).join('\n')
        }).join('\n\n') + `\n}`;

    const queriesForResolverAsWeWantIt = `\tQuery: {\n` + Object
        .keys(typesFromObjects)
        .filter(type => typesFromObjects[type].__level === 1)
        .map(type => {
            return [
                `\t\tget${type}s: (parent, {first = 0, after = 100}, context, info) => { return _${type.toLowerCase()}s.slice(after, first); }`,
                `\t\tget${type}: (parent, {id}, context, info) => { return _${type.toLowerCase()}s.find(item => item.id === id); }`,
            ].join(',\n')
        }).join(',\n\n') + `\n\t}`;

    const mutationsAsWeWantIt = `type Mutation {\n` + Object
        .keys(typesFromObjects)
        .filter(type => typesFromObjects[type].__level === 1)
        .map(type => {
            const properties = Object.keys(typesFromObjects[type]);
            const propertiesAsArray = properties
                .filter(property => property.indexOf('__') === -1)
                .map(property => ({ name: property, type: typesFromObjects[type][property] }));

            const mutations = [
                {
                    operationName: `update${type}`,
                    arguments: propertiesAsArray,
                    returnType: `${type}!`
                },
                {
                    operationName: `delete${type}`,
                    arguments: [{ name: 'id', type: 'ID!' }],
                    returnType: `${type}!`
                },
                {
                    operationName: `insert${type}`,
                    arguments: propertiesAsArray,
                    returnType: `${type}!`
                },
            ];
            return mutations.map(operation => {
                return `\t${operation.operationName}${
                    operation.arguments.length === 0 ? '' : `(${operation.arguments.map(argument => `${argument.name}: ${argument.type}`).join(', ')})`
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
                .map(property => ({ name: property, type: typesFromObjects[type][property] }));

            return [
                `\t\tupdate${type}: (parent, {${propertiesAsArray.map(x => x.name).join(', ')}}, context, info) => {
                    const _item = _${type.toLowerCase()}s.find(_item => _item.id === id);
                    if (_item) {
                        ${propertiesAsArray.map((x, i) => `${i ? `\t\t\t` : ``}_item.${x.name} = ${x.name}`).join(';\n')};
                    }
                    return _item;
                }`,
                    `\t\tdelete${type}: (parent, {id}, context, info) => {
                    const itemIndex = _${type.toLowerCase()}s.findIndex(_item => _item.id === id);
                    if (itemIndex > -1) {
                        return _${type.toLowerCase()}s.splice(itemIndex, 1)[0];
                    }
                    return null;
                }`,
                `\t\tinsert${type}: (parent, {${propertiesAsArray.map(x => x.name).join(', ')}}, context, info) => {
                    let _item = _${type.toLowerCase()}s.find(_item => _item.id === id);
                    if (!_item) {
                        _item = {};
                        ${propertiesAsArray.map((x, i) => `${i ? `\t\t\t` : ``}_item.${x.name} = ${x.name}`).join(';\n')}
                        _${type.toLowerCase()}s.push(_item);
                    }
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
        .map(type => `const _${type.toLowerCase()}s = fs.readFileSync(path.resolve(__dirname, '../data/${type.toLowerCase()}s.json'))`)
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