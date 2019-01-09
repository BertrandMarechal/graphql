# graphql

Testing GrapQL following [this link](https://medium.freecodecamp.org/a-beginners-guide-to-graphql-86f849ce1bec)

## Run

```sh
cd graphql-server
npm install
npm run dev
```

- Navigate to [http://localhost:4000](http://localhost:4000)
- Try the following
  - Get users

```GraphQL
query {
  users {
    id
    name
    email
    age
  }
}
```

  - Get user

```GraphQL
query {
  user(id: 1) {
    id
    name
    email
    age
  }
}
```

  - Create User

```GraphQL
mutation {
  createUser(id: 3, name: "Robert", email: "robert@gmail.com", age: 21) {
    id
    name
    email
    age
  }
}
```

  - Update User

```GraphQL
mutation {
  updateUser(id: 3, name: "Bert") {
    id
    name
    email
    age
  }
}
```

  - Delete User

```GraphQL
mutation {
  deleteUser(id: 3) {
    id
    name
    email
    age
  }
}
```