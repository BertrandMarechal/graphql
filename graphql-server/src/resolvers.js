import { users } from "./db";
import PGP from 'pg-promise';
const pgp = PGP();
const dbs = {};
let db;

const connect = (dbName) => {

    if (!dbs[`postgres://root:route@localhost:5432/${dbName}`]) {
        dbs[`postgres://root:route@localhost:5432/${dbName}`] = pgp(`postgres://root:route@localhost:5432/${dbName}`);
    }
    db = dbs[`postgres://root:route@localhost:5432/${dbName}`];
}

const queryParser = (info) => {
    if (info.fieldNodes) {
        info = info.fieldNodes[0];
    }
    if (!info.selectionSet) {
        return {};
    }
    return {
        fields: info.selectionSet.selections
            .map(x => ({ field: x.name.value, sub: queryParser(x) }))
            .reduce((agg, curr) => ({ ...agg, [curr.field]: curr.sub }), []),
        arguments: info.arguments
            .map(x => ({ [x.name.value]: x.value.kind === 'IntValue' ? +x.value.value : x.value.value }))
    };
}

const resolvers = {
    Query: {
        userFromPG: async (parent, { id }, context, info) => {
            connect('local_cad');
            const query = queryParser(info);

            console.log('context', context);
            console.log('parent', parent);

            const fieldsAndQueries = [{
                field: 'id',
                query: 'pk_usr_id'
            }, {
                field: 'email',
                query: 'usr_email'
            }, {
                field: 'name',
                query: `usr_first_name || ' ' || usr_last_name`
            }, {
                field: 'age',
                query: '21'
            }];
            
            const userFromPG = await db.any(`
                select
                    ${
                        fieldsAndQueries
                            .filter(fieldAndQuery => !!query.fields[fieldAndQuery.field])
                            .map(fieldAndQuery => `${fieldAndQuery.query} as ${fieldAndQuery.field}`)
                            .join(',')
                    }
                from cadt_user_usr
                where pk_usr_id = ${id}`);
            const user = userFromPG[0];
            if (user) {
                const applicationsFromPG = await db.any(`
                    select
                        pk_app_id as id,
                        app_name as name
                    from cadt_application_app
                    inner join cadt_group_grp ON fk_app_grp_application_id = pk_app_id
                    inner join cadt_user_group_usg
                        ON fk_grp_usg_group_id = pk_grp_id
                        and fk_usr_usg_user_id = ${id}`);
                user.applications = applicationsFromPG;
                if (applicationsFromPG && applicationsFromPG.length > 0) {
                    const menusFromPG = await db.any(`
                    select
                            pk_avm_id as id,
                            avm_name as name,
                            avm_link as link,
                            avm_icon as icon
                    from cadt_available_menu_avm
                    INNER JOIN cadt_role_menu_rom ON pk_avm_id = fk_avm_rom_available_menu_id
                    INNER JOIN cadt_role_user_group_rug on fk_rol_rom_role_id = fk_rol_rug_role_id
                    inner join cadt_user_group_usg ON fk_usr_usg_user_id = ${id} AND fk_grp_rug_group_id = fk_grp_usg_group_id
                    WHERE fk_app_avm_application_id IN (${applicationsFromPG.map(x => x.id).join(',')}) `);
                    user.menus = menusFromPG
                }
            }
            return user;
        },
        usersFromPG: async (parent, args, context, info) => {
            const usersFromPG = await db.any(`
                select
                    usr_email as email,
                    pk_usr_id as id,
                    usr_first_name || usr_last_name as name,                    
                    21 as age
                from cadt_user_usr
                where usr_email != ''`);
            return usersFromPG;
        },
        users: async (parent, args, context, info) => {
            return users;
        },
        user: async (parent, { id: ID }, context, info) => {
            return users.find(user => user.id === id);
        },
        channels: async (parent, args, context, info) => {
            connect('local_not');
            // console.log('info', JSON.stringify(info.fieldNodes[0].selectionSet.selections.map(x => x.name.value), null, 2));
            console.log(JSON.stringify(queryParser(info), null, 2));
            
            // console.log('context', context);
            // console.log('parent', parent);
            const channels = await db.any(`
                select
                    pk_chl_id as id,
                    chl_name as name,
                    fk_cty_chl_channel_type_id as channelType,
                    chl_sender as channelStatusId,
                    chl_auth_key as sender,
                    fk_cst_chl_channel_status_id as authKey,
                    chl_host as host,
                    chl_last_started as lastStarted,
                    chl_last_polled as lastPolled,
                    chl_iteration_rate as iterationRate
                from nott_channel_chl`);
            return channels;
        }
    },
    Mutation: {
        createUser: (parent, { id, name, email, age }, context, info) => {
            if (!id || !name || !email) throw new Error("Please provide id, name and email.");

            const newUser = { id, name, email, age };

            users.push(newUser);

            return newUser;
        },
        updateUser: (parent, { id, name, email, age }, context, info) => {

            let newUser = users.find(user => user.id === id);

            newUser.name = name || newUser.name;
            newUser.email = email || newUser.email;
            newUser.age = age || newUser.age;

            return newUser;
        },
        deleteUser: (parent, { id }, context, info) => {
            const userIndex = users.findIndex(user => user.id === id);

            if (userIndex === -1) throw new Error("User not found.");

            const deletedUsers = users.splice(userIndex, 1);

            return deletedUsers[0];
        }
    }
};

export default resolvers;