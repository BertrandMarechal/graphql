import { users } from "./db";
import PGP from 'pg-promise';

const connectionString = 'postgres://root:route@localhost:5432/local_cad';
const pgp = PGP();
const db = pgp(connectionString);


const resolvers = {
    Query: {
        user: async (parent, { id }, context, info) => {
            const user = users.find(user => user.id === +id);
            await new Promise((resolve) => setTimeout(() => resolve(user), 1000));
            return user;
        },
        users: async (parent, args, context, info) => {
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
        users2: async (parent, args, context, info) => {
            const usersFromPG = await db.any('select usr_email from cadt_user_usr');
            console.log(usersFromPG);
            pgp.end();
            return users;
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