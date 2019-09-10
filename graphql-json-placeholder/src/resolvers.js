
const fs = require('fs');
const path = require('path');

const _users = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/users.json')).toString('ascii'));
const _comments = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/comments.json')).toString('ascii'));
const _photos = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/photos.json')).toString('ascii'));
const _posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/posts.json')).toString('ascii'));
const _todos = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/todos.json')).toString('ascii'));
const _albums = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/albums.json')).toString('ascii'));

// object to represent the IDs used for a type
const __ids = {};
__ids['user'] = _users.reduce((agg, curr) => Math.max(agg, curr.id), 0);
__ids['comment'] = _comments.reduce((agg, curr) => Math.max(agg, curr.id), 0);
__ids['photo'] = _photos.reduce((agg, curr) => Math.max(agg, curr.id), 0);
__ids['post'] = _posts.reduce((agg, curr) => Math.max(agg, curr.id), 0);
__ids['todo'] = _todos.reduce((agg, curr) => Math.max(agg, curr.id), 0);
__ids['album'] = _albums.reduce((agg, curr) => Math.max(agg, curr.id), 0);

const resolvers = {
    Query: {
        getUsers: (parent, { first = 100, after = 0 }, context, info) => {

            return {
                totalCount: _users.length,
                users: _users.slice(after, first)
            };
        },
        getUser: (parent, { id }, context, info) => { id = +id; return _users.find(item => item.id === id); },
        getComments: (parent, { first = 100, after = 0, postId }, context, info) => {
            postId = +postId;
            return {
                totalCount: _comments
                    .filter(item => item.postId === (postId || item.postId)).length,
                comments: _comments
                    .filter(item => item.postId === (postId || item.postId)).slice(after, first).map(item => {
                        return {
                            ...item, post: _posts.find(({ id }) => id === item.postId)
                        };
                    })
            };
        },
        getComment: (parent, { id }, context, info) => { id = +id; return _comments.find(item => item.id === id); },
        getPhotos: (parent, { first = 100, after = 0, albumId }, context, info) => {
            albumId = +albumId;
            return {
                totalCount: _photos
                    .filter(item => item.albumId === (albumId || item.albumId)).length,
                photos: _photos
                    .filter(item => item.albumId === (albumId || item.albumId)).slice(after, first).map(item => {
                        return {
                            ...item, album: _albums.find(({ id }) => id === item.albumId)
                        };
                    })
            };
        },
        getPhoto: (parent, { id }, context, info) => { id = +id; return _photos.find(item => item.id === id); },
        getPosts: (parent, { first = 100, after = 0, userId }, context, info) => {
            userId = +userId;
            return {
                totalCount: _posts
                    .filter(item => item.userId === (userId || item.userId)).length,
                posts: _posts
                    .filter(item => item.userId === (userId || item.userId))
                    .slice(after, first)
                    .map(item => {
                        return {
                            ...item,
                            user: _users.find(({ id }) => id === item.userId),
                            comments: _comments.filter(subItem => subItem.postId === item.id)
                        };
                    })
            };
        },
        getPost: (parent, { id }, context, info) => { id = +id; return _posts.find(item => item.id === id); },
        getTodos: (parent, { first = 100, after = 0, userId }, context, info) => {
            userId = +userId;
            return {
                totalCount: _todos
                    .filter(item => item.userId === (userId || item.userId)).length,
                todos: _todos
                    .filter(item => item.userId === (userId || item.userId)).slice(after, first).map(item => {
                        return {
                            ...item, user: _users.find(({ id }) => id === item.userId)
                        };
                    })
            };
        },
        getTodo: (parent, { id }, context, info) => { id = +id; return _todos.find(item => item.id === id); },
        getAlbums: (parent, { first = 100, after = 0, userId }, context, info) => {
            userId = +userId;
            return {
                totalCount: _albums
                    .filter(item => item.userId === (userId || item.userId)).length,
                albums: _albums
                    .filter(item => item.userId === (userId || item.userId)).slice(after, first).map(item => {
                        return {
                            ...item, user: _users.find(({ id }) => id === item.userId)
                        };
                    })
            };
        },
        getAlbum: (parent, { id }, context, info) => { id = +id; return _albums.find(item => item.id === id); }
    },
    Mutation: {
        updateUser: (parent, { id, name, username, email, address, phone, website, company }, context, info) => {
            id = +id;
            if (!id) throw 'Missing property id';
            if (!name) throw 'Missing property name';
            if (!username) throw 'Missing property username';

            const _item = _users.find(_item => _item.id === id);
            if (_item) {
                _item.id = id;
                _item.name = name;
                _item.username = username;
                _item.email = email;
                _item.address = address;
                _item.phone = phone;
                _item.website = website;
                _item.company = company;
            }
            return _item;
        },
        deleteUser: (parent, { id }, context, info) => {
            if (!id) throw 'Missing property id';
            id = +id;
            const itemIndex = _users.findIndex(_item => _item.id === id);
            if (itemIndex > -1) {
                return _users.splice(itemIndex, 1)[0];
            }
            return null;
        },
        insertUser: (parent, { name, username, email, address, phone, website, company }, context, info) => {
            if (!name) throw 'Missing property name';
            if (!username) throw 'Missing property username';

            const _item = {};
            _item.name = name;
            _item.username = username;
            _item.email = email;
            _item.address = address;
            _item.phone = phone;
            _item.website = website;
            _item.company = company
            __ids['user']++;
            _item.id = __ids['user'];
            _users.push(_item);
            return _item;
        },

        updateComment: (parent, { id, name, email, body, postId }, context, info) => {
            id = +id;
            if (!id) throw 'Missing property id';
            if (!name) throw 'Missing property name';
            if (!email) throw 'Missing property email';
            if (!postId) throw 'Missing property postId';
            postId = +postId;
            const _item = _comments.find(_item => _item.id === id);
            if (_item) {
                _item.id = id;
                _item.name = name;
                _item.email = email;
                _item.body = body;
                _item.postId = postId;
            }
            return _item;
        },
        deleteComment: (parent, { id }, context, info) => {
            if (!id) throw 'Missing property id';
            id = +id;
            const itemIndex = _comments.findIndex(_item => _item.id === id);
            if (itemIndex > -1) {
                return _comments.splice(itemIndex, 1)[0];
            }
            return null;
        },
        insertComment: (parent, { name, email, body, postId }, context, info) => {
            if (!name) throw 'Missing property name';
            if (!email) throw 'Missing property email';
            if (!postId) throw 'Missing property postId';
            postId = +postId;
            const _item = {};
            _item.name = name;
            _item.email = email;
            _item.body = body;
            _item.postId = postId
            __ids['comment']++;
            _item.id = __ids['comment'];
            _comments.push(_item);
            return _item;
        },

        updatePhoto: (parent, { id, title, url, thumbnailUrl, albumId }, context, info) => {
            id = +id;
            if (!id) throw 'Missing property id';
            if (!title) throw 'Missing property title';
            if (!url) throw 'Missing property url';
            if (!albumId) throw 'Missing property albumId';
            albumId = +albumId;
            const _item = _photos.find(_item => _item.id === id);
            if (_item) {
                _item.id = id;
                _item.title = title;
                _item.url = url;
                _item.thumbnailUrl = thumbnailUrl;
                _item.albumId = albumId;
            }
            return _item;
        },
        deletePhoto: (parent, { id }, context, info) => {
            if (!id) throw 'Missing property id';
            id = +id;
            const itemIndex = _photos.findIndex(_item => _item.id === id);
            if (itemIndex > -1) {
                return _photos.splice(itemIndex, 1)[0];
            }
            return null;
        },
        insertPhoto: (parent, { title, url, thumbnailUrl, albumId }, context, info) => {
            if (!title) throw 'Missing property title';
            if (!url) throw 'Missing property url';
            if (!albumId) throw 'Missing property albumId';
            albumId = +albumId;
            const _item = {};
            _item.title = title;
            _item.url = url;
            _item.thumbnailUrl = thumbnailUrl;
            _item.albumId = albumId
            __ids['photo']++;
            _item.id = __ids['photo'];
            _photos.push(_item);
            return _item;
        },

        updatePost: (parent, { id, title, body, userId }, context, info) => {
            id = +id;
            if (!id) throw 'Missing property id';
            if (!title) throw 'Missing property title';
            if (!body) throw 'Missing property body';
            if (!userId) throw 'Missing property userId';
            userId = +userId;
            const _item = _posts.find(_item => _item.id === id);
            if (_item) {
                _item.id = id;
                _item.title = title;
                _item.body = body;
                _item.userId = userId;
            }
            return _item;
        },
        deletePost: (parent, { id }, context, info) => {
            if (!id) throw 'Missing property id';
            id = +id;
            const itemIndex = _posts.findIndex(_item => _item.id === id);
            if (itemIndex > -1) {
                return _posts.splice(itemIndex, 1)[0];
            }
            return null;
        },
        insertPost: (parent, { title, body, userId }, context, info) => {
            if (!title) throw 'Missing property title';
            if (!body) throw 'Missing property body';
            if (!userId) throw 'Missing property userId';
            userId = +userId;
            const _item = {};
            _item.title = title;
            _item.body = body;
            _item.userId = userId
            __ids['post']++;
            _item.id = __ids['post'];
            _posts.push(_item);
            return _item;
        },

        updateTodo: (parent, { id, title, completed, userId }, context, info) => {
            id = +id;
            if (!id) throw 'Missing property id';
            if (!title) throw 'Missing property title';
            if (!completed) throw 'Missing property completed';
            if (!userId) throw 'Missing property userId';
            userId = +userId;
            const _item = _todos.find(_item => _item.id === id);
            if (_item) {
                _item.id = id;
                _item.title = title;
                _item.completed = completed;
                _item.userId = userId;
            }
            return _item;
        },
        deleteTodo: (parent, { id }, context, info) => {
            if (!id) throw 'Missing property id';
            id = +id;
            const itemIndex = _todos.findIndex(_item => _item.id === id);
            if (itemIndex > -1) {
                return _todos.splice(itemIndex, 1)[0];
            }
            return null;
        },
        insertTodo: (parent, { title, completed, userId }, context, info) => {
            if (!title) throw 'Missing property title';
            if (!completed) throw 'Missing property completed';
            if (!userId) throw 'Missing property userId';
            userId = +userId;
            const _item = {};
            _item.title = title;
            _item.completed = completed;
            _item.userId = userId
            __ids['todo']++;
            _item.id = __ids['todo'];
            _todos.push(_item);
            return _item;
        },

        updateAlbum: (parent, { id, title, userId }, context, info) => {
            id = +id;
            if (!id) throw 'Missing property id';
            if (!title) throw 'Missing property title';
            if (!userId) throw 'Missing property userId';
            userId = +userId;
            const _item = _albums.find(_item => _item.id === id);
            if (_item) {
                _item.id = id;
                _item.title = title;
                _item.userId = userId;
            }
            return _item;
        },
        deleteAlbum: (parent, { id }, context, info) => {
            if (!id) throw 'Missing property id';
            id = +id;
            const itemIndex = _albums.findIndex(_item => _item.id === id);
            if (itemIndex > -1) {
                return _albums.splice(itemIndex, 1)[0];
            }
            return null;
        },
        insertAlbum: (parent, { title, userId }, context, info) => {
            if (!title) throw 'Missing property title';
            if (!userId) throw 'Missing property userId';
            userId = +userId;
            const _item = {};
            _item.title = title;
            _item.userId = userId
            __ids['album']++;
            _item.id = __ids['album'];
            _albums.push(_item);
            return _item;
        }
    },
};
export default resolvers;
