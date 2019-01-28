
const fs = require('fs');
const path = require('path');

const _users = fs.readFileSync(path.resolve(__dirname, '../data/users.json'))
const _comments = fs.readFileSync(path.resolve(__dirname, '../data/comments.json'))
const _photos = fs.readFileSync(path.resolve(__dirname, '../data/photos.json'))
const _posts = fs.readFileSync(path.resolve(__dirname, '../data/posts.json'))
const _todos = fs.readFileSync(path.resolve(__dirname, '../data/todos.json'))

const resolvers = {
	Query: {
		getUsers: (parent, {first = 0, after = 100}, context, info) => { return _users.slice(after, first); },
		getUser: (parent, {id}, context, info) => { return _users.find(item => item.id === id); },

		getComments: (parent, {first = 0, after = 100}, context, info) => { return _comments.slice(after, first); },
		getComment: (parent, {id}, context, info) => { return _comments.find(item => item.id === id); },

		getPhotos: (parent, {first = 0, after = 100}, context, info) => { return _photos.slice(after, first); },
		getPhoto: (parent, {id}, context, info) => { return _photos.find(item => item.id === id); },

		getPosts: (parent, {first = 0, after = 100}, context, info) => { return _posts.slice(after, first); },
		getPost: (parent, {id}, context, info) => { return _posts.find(item => item.id === id); },

		getTodos: (parent, {first = 0, after = 100}, context, info) => { return _todos.slice(after, first); },
		getTodo: (parent, {id}, context, info) => { return _todos.find(item => item.id === id); }
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

		updateComment: (parent, {postId, id, name, email, body}, context, info) => {
                    const _item = _comments.find(_item => _item.id === id);
                    if (_item) {
                        _item.postId = postId;
			_item.id = id;
			_item.name = name;
			_item.email = email;
			_item.body = body;
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
		insertComment: (parent, {postId, id, name, email, body}, context, info) => {
                    let _item = _comments.find(_item => _item.id === id);
                    if (!_item) {
                        _item = {};
                        _item.postId = postId;
			_item.id = id;
			_item.name = name;
			_item.email = email;
			_item.body = body
                        _comments.push(_item);
                    }
                    return _item;
                },

		updatePhoto: (parent, {albumId, id, title, url, thumbnailUrl}, context, info) => {
                    const _item = _photos.find(_item => _item.id === id);
                    if (_item) {
                        _item.albumId = albumId;
			_item.id = id;
			_item.title = title;
			_item.url = url;
			_item.thumbnailUrl = thumbnailUrl;
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
		insertPhoto: (parent, {albumId, id, title, url, thumbnailUrl}, context, info) => {
                    let _item = _photos.find(_item => _item.id === id);
                    if (!_item) {
                        _item = {};
                        _item.albumId = albumId;
			_item.id = id;
			_item.title = title;
			_item.url = url;
			_item.thumbnailUrl = thumbnailUrl
                        _photos.push(_item);
                    }
                    return _item;
                },

		updatePost: (parent, {userId, id, title, body}, context, info) => {
                    const _item = _posts.find(_item => _item.id === id);
                    if (_item) {
                        _item.userId = userId;
			_item.id = id;
			_item.title = title;
			_item.body = body;
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
		insertPost: (parent, {userId, id, title, body}, context, info) => {
                    let _item = _posts.find(_item => _item.id === id);
                    if (!_item) {
                        _item = {};
                        _item.userId = userId;
			_item.id = id;
			_item.title = title;
			_item.body = body
                        _posts.push(_item);
                    }
                    return _item;
                },

		updateTodo: (parent, {userId, id, title, completed}, context, info) => {
                    const _item = _todos.find(_item => _item.id === id);
                    if (_item) {
                        _item.userId = userId;
			_item.id = id;
			_item.title = title;
			_item.completed = completed;
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
		insertTodo: (parent, {userId, id, title, completed}, context, info) => {
                    let _item = _todos.find(_item => _item.id === id);
                    if (!_item) {
                        _item = {};
                        _item.userId = userId;
			_item.id = id;
			_item.title = title;
			_item.completed = completed
                        _todos.push(_item);
                    }
                    return _item;
                }
	},
};
export default resolvers;
    