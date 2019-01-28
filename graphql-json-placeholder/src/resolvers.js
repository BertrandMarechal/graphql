
const fs = require('fs');
const path = require('path');

const _users = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/users.json')).toString('ascii'))
const _comments = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/comments.json')).toString('ascii'))
const _photos = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/photos.json')).toString('ascii'))
const _posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/posts.json')).toString('ascii'))
const _todos = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/todos.json')).toString('ascii'))
const _albums = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/albums.json')).toString('ascii'))

const resolvers = {
	Query: {
		getUsers: (parent, {first = 100, after = 0}, context, info) => { return {
                    totalCount: _users.length, users: _users.slice(after, first)};
                },
		getUser: (parent, {id}, context, info) => { id = +id; return _users.find(item => item.id === id); },

		getComments: (parent, {first = 100, after = 0, postId}, context, info) => { return {
                    totalCount: _comments.length, comments: _comments.slice(after, first).map(item => {
                            return {...item, post: _posts.find(({id}) => id === item.postId)};
                        })};
                },
		getComment: (parent, {id}, context, info) => { id = +id; return _comments.find(item => item.id === id); },

		getPhotos: (parent, {first = 100, after = 0, albumId}, context, info) => { return {
                    totalCount: _photos.length, photos: _photos.slice(after, first).map(item => {
                            return {...item, album: _albums.find(({id}) => id === item.albumId)};
                        })};
                },
		getPhoto: (parent, {id}, context, info) => { id = +id; return _photos.find(item => item.id === id); },

		getPosts: (parent, {first = 100, after = 0, userId}, context, info) => { return {
                    totalCount: _posts.length, posts: _posts.slice(after, first).map(item => {
                            return {...item, user: _users.find(({id}) => id === item.userId)};
                        })};
                },
		getPost: (parent, {id}, context, info) => { id = +id; return _posts.find(item => item.id === id); },

		getTodos: (parent, {first = 100, after = 0, userId}, context, info) => { return {
                    totalCount: _todos.length, todos: _todos.slice(after, first).map(item => {
                            return {...item, user: _users.find(({id}) => id === item.userId)};
                        })};
                },
		getTodo: (parent, {id}, context, info) => { id = +id; return _todos.find(item => item.id === id); },

		getAlbums: (parent, {first = 100, after = 0, userId}, context, info) => { return {
                    totalCount: _albums.length, albums: _albums.slice(after, first).map(item => {
                            return {...item, user: _users.find(({id}) => id === item.userId)};
                        })};
                },
		getAlbum: (parent, {id}, context, info) => { id = +id; return _albums.find(item => item.id === id); }
	},
	Mutation: {
		updateUser: (parent, {id, name, username, email, address, phone, website, company}, context, info) => {
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
		deleteUser: (parent, {id}, context, info) => {
                    const itemIndex = _users.findIndex(_item => _item.id === id);
                    if (itemIndex > -1) {
                        return _users.splice(itemIndex, 1)[0];
                    }
                    return null;
                },
		insertUser: (parent, {id, name, username, email, address, phone, website, company}, context, info) => {
                    let _item = _users.find(_item => _item.id === id);
                    if (!_item) {
                        _item = {};
                        _item.id = id;
			_item.name = name;
			_item.username = username;
			_item.email = email;
			_item.address = address;
			_item.phone = phone;
			_item.website = website;
			_item.company = company
                        _users.push(_item);
                    }
                    return _item;
                },

		updateComment: (parent, {id, name, email, body, postId}, context, info) => {
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
		deleteComment: (parent, {id}, context, info) => {
                    const itemIndex = _comments.findIndex(_item => _item.id === id);
                    if (itemIndex > -1) {
                        return _comments.splice(itemIndex, 1)[0];
                    }
                    return null;
                },
		insertComment: (parent, {id, name, email, body, postId}, context, info) => {
                    let _item = _comments.find(_item => _item.id === id);
                    if (!_item) {
                        _item = {};
                        _item.id = id;
			_item.name = name;
			_item.email = email;
			_item.body = body;
			_item.postId = postId
                        _comments.push(_item);
                    }
                    return _item;
                },

		updatePhoto: (parent, {id, title, url, thumbnailUrl, albumId}, context, info) => {
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
		deletePhoto: (parent, {id}, context, info) => {
                    const itemIndex = _photos.findIndex(_item => _item.id === id);
                    if (itemIndex > -1) {
                        return _photos.splice(itemIndex, 1)[0];
                    }
                    return null;
                },
		insertPhoto: (parent, {id, title, url, thumbnailUrl, albumId}, context, info) => {
                    let _item = _photos.find(_item => _item.id === id);
                    if (!_item) {
                        _item = {};
                        _item.id = id;
			_item.title = title;
			_item.url = url;
			_item.thumbnailUrl = thumbnailUrl;
			_item.albumId = albumId
                        _photos.push(_item);
                    }
                    return _item;
                },

		updatePost: (parent, {id, title, body, userId}, context, info) => {
                    const _item = _posts.find(_item => _item.id === id);
                    if (_item) {
                        _item.id = id;
			_item.title = title;
			_item.body = body;
			_item.userId = userId;
                    }
                    return _item;
                },
		deletePost: (parent, {id}, context, info) => {
                    const itemIndex = _posts.findIndex(_item => _item.id === id);
                    if (itemIndex > -1) {
                        return _posts.splice(itemIndex, 1)[0];
                    }
                    return null;
                },
		insertPost: (parent, {id, title, body, userId}, context, info) => {
                    let _item = _posts.find(_item => _item.id === id);
                    if (!_item) {
                        _item = {};
                        _item.id = id;
			_item.title = title;
			_item.body = body;
			_item.userId = userId
                        _posts.push(_item);
                    }
                    return _item;
                },

		updateTodo: (parent, {id, title, completed, userId}, context, info) => {
                    const _item = _todos.find(_item => _item.id === id);
                    if (_item) {
                        _item.id = id;
			_item.title = title;
			_item.completed = completed;
			_item.userId = userId;
                    }
                    return _item;
                },
		deleteTodo: (parent, {id}, context, info) => {
                    const itemIndex = _todos.findIndex(_item => _item.id === id);
                    if (itemIndex > -1) {
                        return _todos.splice(itemIndex, 1)[0];
                    }
                    return null;
                },
		insertTodo: (parent, {id, title, completed, userId}, context, info) => {
                    let _item = _todos.find(_item => _item.id === id);
                    if (!_item) {
                        _item = {};
                        _item.id = id;
			_item.title = title;
			_item.completed = completed;
			_item.userId = userId
                        _todos.push(_item);
                    }
                    return _item;
                },

		updateAlbum: (parent, {id, title, userId}, context, info) => {
                    const _item = _albums.find(_item => _item.id === id);
                    if (_item) {
                        _item.id = id;
			_item.title = title;
			_item.userId = userId;
                    }
                    return _item;
                },
		deleteAlbum: (parent, {id}, context, info) => {
                    const itemIndex = _albums.findIndex(_item => _item.id === id);
                    if (itemIndex > -1) {
                        return _albums.splice(itemIndex, 1)[0];
                    }
                    return null;
                },
		insertAlbum: (parent, {id, title, userId}, context, info) => {
                    let _item = _albums.find(_item => _item.id === id);
                    if (!_item) {
                        _item = {};
                        _item.id = id;
			_item.title = title;
			_item.userId = userId
                        _albums.push(_item);
                    }
                    return _item;
                }
	},
};
export default resolvers;
    