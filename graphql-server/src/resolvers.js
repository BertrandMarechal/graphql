import { users } from "./db";

const resolvers = {
    Query: {
        user: async (parent, { id }, context, info) => {
            const user = users.find(user => user.id === +id);
            await new Promise((resolve) => setTimeout(() => resolve(user), 1000));
            return user;
        },
        users: (parent, args, context, info) => {
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