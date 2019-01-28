module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/graphpack/config/index.js":
/*!************************************************!*\
  !*** ./node_modules/graphpack/config/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const cosmiconfig = __webpack_require__(/*! cosmiconfig */ "cosmiconfig");

const webpack = __webpack_require__(/*! webpack */ "webpack");

const defaultConfig = __webpack_require__(/*! ./webpack.config */ "./node_modules/graphpack/config/webpack.config.js");

const explorer = cosmiconfig('graphpack').search();

const loadServerConfig = async () => {
  const result = await explorer;
  const userConfig = result ? typeof result.config === 'function' ? result.config(defaultConfig.mode) : result.config : {};
  return {
    port: Number(process.env.PORT),
    ...userConfig.server
  };
};

const loadWebpackConfig = async () => {
  const result = await explorer;
  const userConfig = result ? typeof result.config === 'function' ? result.config(defaultConfig.mode) : result.config : {};

  if (typeof userConfig.webpack === 'function') {
    return userConfig.webpack({
      config: defaultConfig,
      webpack
    });
  }

  return { ...defaultConfig,
    ...userConfig.webpack
  };
};

exports.loadServerConfig = loadServerConfig;
exports.loadWebpackConfig = loadWebpackConfig;

/***/ }),

/***/ "./node_modules/graphpack/config/webpack.config.js":
/*!*********************************************************!*\
  !*** ./node_modules/graphpack/config/webpack.config.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const FriendlyErrorsWebpackPlugin = __webpack_require__(/*! friendly-errors-webpack-plugin */ "friendly-errors-webpack-plugin");

const fs = __webpack_require__(/*! fs */ "fs");

const path = __webpack_require__(/*! path */ "path");

const webpack = __webpack_require__(/*! webpack */ "webpack");

const nodeExternals = __webpack_require__(/*! webpack-node-externals */ "webpack-node-externals");

const isDev = "development" !== 'production';
const isWebpack = typeof __webpack_require__.m === 'object';
const hasBabelRc = fs.existsSync(path.resolve('babel.config.js'));

if (hasBabelRc && !isWebpack) {
  console.info('🐠 Using babel.config.js defined in your app root');
}

module.exports = {
  devtool: 'source-map',
  entry: {
    // We take care of setting up entry file under lib/index.js
    index: ['graphpack']
  },
  // When bundling with Webpack for the backend you usually don't want to bundle
  // its node_modules dependencies. This creates an externals function that
  // ignores node_modules when bundling in Webpack.
  externals: [nodeExternals({
    whitelist: [/^graphpack$/]
  })],
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
      test: /\.(gql|graphql)/,
      use: 'graphql-tag/loader'
    }, {
      test: /\.(js|ts)$/,
      use: [{
        loader: /*require.resolve*/(/*! babel-loader */ "babel-loader"),
        options: {
          babelrc: true,
          cacheDirectory: true,
          presets: hasBabelRc ? undefined : [/*require.resolve*/(/*! babel-preset-graphpack */ "babel-preset-graphpack")]
        }
      }]
    }, {
      test: /\.mjs$/,
      type: 'javascript/auto'
    }]
  },
  node: {
    __filename: true,
    __dirname: true
  },
  optimization: {
    noEmitOnErrors: true
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(process.cwd(), './build'),
    sourceMapFilename: '[name].map'
  },
  performance: {
    hints: false
  },
  plugins: [new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1
  }), new webpack.EnvironmentPlugin({
    DEBUG: false,
    GRAPHPACK_SRC_DIR: path.resolve(process.cwd(), 'src'),
    NODE_ENV: 'development'
  }), new FriendlyErrorsWebpackPlugin({
    clearConsole: isDev
  })],
  resolve: {
    extensions: ['.ts', '.js']
  },
  stats: 'minimal',
  target: 'node'
};

/***/ }),

/***/ "./node_modules/graphpack/lib/server.js":
/*!**********************************************!*\
  !*** ./node_modules/graphpack/lib/server.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-server */ "apollo-server");
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _srcFiles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./srcFiles */ "./node_modules/graphpack/lib/srcFiles.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./node_modules/graphpack/config/index.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_config__WEBPACK_IMPORTED_MODULE_3__);





if (!(_srcFiles__WEBPACK_IMPORTED_MODULE_2__["resolvers"] && Object.keys(_srcFiles__WEBPACK_IMPORTED_MODULE_2__["resolvers"]).length > 0)) {
  throw Error(`Couldn't find any resolvers. Please add resolvers to your src/resolvers.js`);
}

const createServer = config => {
  const {
    applyMiddleware,
    port: serverPort,
    ...options
  } = config;
  const port = Number(process.env.PORT) || serverPort || 4000; // Pull out fields that are not relevant for the apollo server
  // Use apollo-server-express when middleware detected

  if (applyMiddleware && applyMiddleware.app && typeof applyMiddleware.app.listen === 'function') {
    const server = new apollo_server_express__WEBPACK_IMPORTED_MODULE_1__["ApolloServer"](options);
    server.applyMiddleware(applyMiddleware);
    return applyMiddleware.app.listen({
      port
    }, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
  } // Use apollo-server


  const server = new apollo_server__WEBPACK_IMPORTED_MODULE_0__["ApolloServer"](options);
  return server.listen({
    port
  }).then(({
    url
  }) => console.log(`🚀 Server ready at ${url}`));
};

const startServer = async () => {
  // Load server config from graphpack.config.js
  const config = await Object(_config__WEBPACK_IMPORTED_MODULE_3__["loadServerConfig"])();
  createServer({ ...config,
    context: _srcFiles__WEBPACK_IMPORTED_MODULE_2__["context"],
    resolvers: _srcFiles__WEBPACK_IMPORTED_MODULE_2__["resolvers"],
    typeDefs: _srcFiles__WEBPACK_IMPORTED_MODULE_2__["typeDefs"]
  });
};

startServer();

/***/ }),

/***/ "./node_modules/graphpack/lib/srcFiles.js":
/*!************************************************!*\
  !*** ./node_modules/graphpack/lib/srcFiles.js ***!
  \************************************************/
/*! exports provided: importFirst, context, resolvers, typeDefs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importFirst", function() { return importFirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "context", function() { return context; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolvers", function() { return resolvers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "typeDefs", function() { return typeDefs; });
const importFirst = req => req.keys().map(mod => req(mod).default || req(mod))[0]; // Optionally import modules

const context = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$"));
const resolvers = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$"));
const typeDefs = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$"));

/***/ }),

/***/ "./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$":
/*!**********************************************************!*\
  !*** ./src sync ^\.\/(context|context\/index)\.(js|ts)$ ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$";

/***/ }),

/***/ "./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$":
/*!**************************************************************!*\
  !*** ./src sync ^\.\/(resolvers|resolvers\/index)\.(js|ts)$ ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./resolvers.js": "./src/resolvers.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$";

/***/ }),

/***/ "./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$":
/*!********************************************************************!*\
  !*** ./src sync ^\.\/(schema|schema\/index)\.(gql|graphql|js|ts)$ ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./schema.graphql": "./src/schema.graphql"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$";

/***/ }),

/***/ "./src/resolvers.js":
/*!**************************!*\
  !*** ./src/resolvers.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {const fs = __webpack_require__(/*! fs */ "fs");

const path = __webpack_require__(/*! path */ "path");

const _users = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/users.json')).toString('ascii'));

const _comments = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/comments.json')).toString('ascii'));

const _photos = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/photos.json')).toString('ascii'));

const _posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/posts.json')).toString('ascii'));

const _todos = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/todos.json')).toString('ascii'));

const _albums = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/albums.json')).toString('ascii'));

const resolvers = {
  Query: {
    getUsers: (parent, {
      first = 100,
      after = 0
    }, context, info) => {
      return {
        totalCount: _users.length,
        users: _users.slice(after, first)
      };
    },
    getUser: (parent, {
      id
    }, context, info) => {
      id = +id;
      return _users.find(item => item.id === id);
    },
    getComments: (parent, {
      first = 100,
      after = 0,
      postId
    }, context, info) => {
      return {
        totalCount: _comments.length,
        comments: _comments.slice(after, first).map(item => {
          return { ...item,
            post: _posts.find(({
              id
            }) => id === item.postId)
          };
        })
      };
    },
    getComment: (parent, {
      id
    }, context, info) => {
      id = +id;
      return _comments.find(item => item.id === id);
    },
    getPhotos: (parent, {
      first = 100,
      after = 0,
      albumId
    }, context, info) => {
      return {
        totalCount: _photos.length,
        photos: _photos.slice(after, first).map(item => {
          return { ...item,
            album: _albums.find(({
              id
            }) => id === item.albumId)
          };
        })
      };
    },
    getPhoto: (parent, {
      id
    }, context, info) => {
      id = +id;
      return _photos.find(item => item.id === id);
    },
    getPosts: (parent, {
      first = 100,
      after = 0,
      userId
    }, context, info) => {
      return {
        totalCount: _posts.length,
        posts: _posts.slice(after, first).map(item => {
          return { ...item,
            user: _users.find(({
              id
            }) => id === item.userId)
          };
        })
      };
    },
    getPost: (parent, {
      id
    }, context, info) => {
      id = +id;
      return _posts.find(item => item.id === id);
    },
    getTodos: (parent, {
      first = 100,
      after = 0,
      userId
    }, context, info) => {
      return {
        totalCount: _todos.length,
        todos: _todos.slice(after, first).map(item => {
          return { ...item,
            user: _users.find(({
              id
            }) => id === item.userId)
          };
        })
      };
    },
    getTodo: (parent, {
      id
    }, context, info) => {
      id = +id;
      return _todos.find(item => item.id === id);
    },
    getAlbums: (parent, {
      first = 100,
      after = 0,
      userId
    }, context, info) => {
      return {
        totalCount: _albums.length,
        albums: _albums.slice(after, first).map(item => {
          return { ...item,
            user: _users.find(({
              id
            }) => id === item.userId)
          };
        })
      };
    },
    getAlbum: (parent, {
      id
    }, context, info) => {
      id = +id;
      return _albums.find(item => item.id === id);
    }
  },
  Mutation: {
    updateUser: (parent, {
      id,
      name,
      username,
      email,
      address,
      phone,
      website,
      company
    }, context, info) => {
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
    deleteUser: (parent, {
      id
    }, context, info) => {
      const itemIndex = _users.findIndex(_item => _item.id === id);

      if (itemIndex > -1) {
        return _users.splice(itemIndex, 1)[0];
      }

      return null;
    },
    insertUser: (parent, {
      id,
      name,
      username,
      email,
      address,
      phone,
      website,
      company
    }, context, info) => {
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
        _item.company = company;

        _users.push(_item);
      }

      return _item;
    },
    updateComment: (parent, {
      id,
      name,
      email,
      body,
      postId
    }, context, info) => {
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
    deleteComment: (parent, {
      id
    }, context, info) => {
      const itemIndex = _comments.findIndex(_item => _item.id === id);

      if (itemIndex > -1) {
        return _comments.splice(itemIndex, 1)[0];
      }

      return null;
    },
    insertComment: (parent, {
      id,
      name,
      email,
      body,
      postId
    }, context, info) => {
      let _item = _comments.find(_item => _item.id === id);

      if (!_item) {
        _item = {};
        _item.id = id;
        _item.name = name;
        _item.email = email;
        _item.body = body;
        _item.postId = postId;

        _comments.push(_item);
      }

      return _item;
    },
    updatePhoto: (parent, {
      id,
      title,
      url,
      thumbnailUrl,
      albumId
    }, context, info) => {
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
    deletePhoto: (parent, {
      id
    }, context, info) => {
      const itemIndex = _photos.findIndex(_item => _item.id === id);

      if (itemIndex > -1) {
        return _photos.splice(itemIndex, 1)[0];
      }

      return null;
    },
    insertPhoto: (parent, {
      id,
      title,
      url,
      thumbnailUrl,
      albumId
    }, context, info) => {
      let _item = _photos.find(_item => _item.id === id);

      if (!_item) {
        _item = {};
        _item.id = id;
        _item.title = title;
        _item.url = url;
        _item.thumbnailUrl = thumbnailUrl;
        _item.albumId = albumId;

        _photos.push(_item);
      }

      return _item;
    },
    updatePost: (parent, {
      id,
      title,
      body,
      userId
    }, context, info) => {
      const _item = _posts.find(_item => _item.id === id);

      if (_item) {
        _item.id = id;
        _item.title = title;
        _item.body = body;
        _item.userId = userId;
      }

      return _item;
    },
    deletePost: (parent, {
      id
    }, context, info) => {
      const itemIndex = _posts.findIndex(_item => _item.id === id);

      if (itemIndex > -1) {
        return _posts.splice(itemIndex, 1)[0];
      }

      return null;
    },
    insertPost: (parent, {
      id,
      title,
      body,
      userId
    }, context, info) => {
      let _item = _posts.find(_item => _item.id === id);

      if (!_item) {
        _item = {};
        _item.id = id;
        _item.title = title;
        _item.body = body;
        _item.userId = userId;

        _posts.push(_item);
      }

      return _item;
    },
    updateTodo: (parent, {
      id,
      title,
      completed,
      userId
    }, context, info) => {
      const _item = _todos.find(_item => _item.id === id);

      if (_item) {
        _item.id = id;
        _item.title = title;
        _item.completed = completed;
        _item.userId = userId;
      }

      return _item;
    },
    deleteTodo: (parent, {
      id
    }, context, info) => {
      const itemIndex = _todos.findIndex(_item => _item.id === id);

      if (itemIndex > -1) {
        return _todos.splice(itemIndex, 1)[0];
      }

      return null;
    },
    insertTodo: (parent, {
      id,
      title,
      completed,
      userId
    }, context, info) => {
      let _item = _todos.find(_item => _item.id === id);

      if (!_item) {
        _item = {};
        _item.id = id;
        _item.title = title;
        _item.completed = completed;
        _item.userId = userId;

        _todos.push(_item);
      }

      return _item;
    },
    updateAlbum: (parent, {
      id,
      title,
      userId
    }, context, info) => {
      const _item = _albums.find(_item => _item.id === id);

      if (_item) {
        _item.id = id;
        _item.title = title;
        _item.userId = userId;
      }

      return _item;
    },
    deleteAlbum: (parent, {
      id
    }, context, info) => {
      const itemIndex = _albums.findIndex(_item => _item.id === id);

      if (itemIndex > -1) {
        return _albums.splice(itemIndex, 1)[0];
      }

      return null;
    },
    insertAlbum: (parent, {
      id,
      title,
      userId
    }, context, info) => {
      let _item = _albums.find(_item => _item.id === id);

      if (!_item) {
        _item = {};
        _item.id = id;
        _item.title = title;
        _item.userId = userId;

        _albums.push(_item);
      }

      return _item;
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (resolvers);
/* WEBPACK VAR INJECTION */}.call(this, "src"))

/***/ }),

/***/ "./src/schema.graphql":
/*!****************************!*\
  !*** ./src/schema.graphql ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"User"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"username"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"email"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"address"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"phone"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"website"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"company"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Company"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Address"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"street"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"suite"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"city"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zipcode"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"geo"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Geo"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Geo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"lat"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lng"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Company"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"catchPhrase"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"bs"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Comment"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"email"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"body"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"post"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Photo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"title"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"url"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"thumbnailUrl"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"album"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Album"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Post"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"title"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"body"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"user"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Todo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"title"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"completed"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"user"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Album"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"title"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"user"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"UserPaginated"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"totalCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"users"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CommentPaginated"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"totalCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"comments"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"PhotoPaginated"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"totalCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"photos"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Photo"}}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"PostPaginated"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"totalCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"posts"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"TodoPaginated"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"totalCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"todos"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Todo"}}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AlbumPaginated"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"totalCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"albums"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Album"}}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"AddressInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"street"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"suite"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"city"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zipcode"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"geo"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeoInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"GeoInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"lat"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"lng"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CompanyInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"catchPhrase"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"bs"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"first"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"after"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserPaginated"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getComments"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"first"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"after"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"postId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentPaginated"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getComment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getPhotos"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"first"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"after"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"albumId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"PhotoPaginated"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getPhoto"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Photo"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getPosts"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"first"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"after"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostPaginated"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getPost"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getTodos"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"first"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"after"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"TodoPaginated"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getTodo"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Todo"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getAlbums"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"first"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"after"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AlbumPaginated"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getAlbum"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Album"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"address"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddressInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"phone"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"website"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"company"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompanyInput"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertUser"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"address"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddressInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"phone"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"website"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"company"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompanyInput"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateComment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"body"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"postId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteComment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertComment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"body"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"postId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updatePhoto"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"url"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"thumbnailUrl"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"albumId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Photo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deletePhoto"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Photo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertPhoto"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"url"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"thumbnailUrl"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"albumId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Photo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updatePost"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"body"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deletePost"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertPost"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"body"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateTodo"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"completed"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Todo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteTodo"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Todo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertTodo"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"completed"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Todo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateAlbum"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Album"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteAlbum"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Album"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"insertAlbum"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Album"}}},"directives":[]}]}],"loc":{"start":0,"end":3153}};
    doc.loc.source = {"body":"type User {\n\tid: ID!\n\tname: String!\n\tusername: String!\n\temail: String!\n\taddress: Address!\n\tphone: String!\n\twebsite: String!\n\tcompany: Company!\n}\ntype Address {\n\tstreet: String!\n\tsuite: String!\n\tcity: String!\n\tzipcode: String!\n\tgeo: Geo!\n}\ntype Geo {\n\tlat: Float!\n\tlng: Float!\n}\ntype Company {\n\tname: String!\n\tcatchPhrase: String!\n\tbs: String!\n}\ntype Comment {\n\tid: ID!\n\tname: String!\n\temail: String!\n\tbody: String!\n\tpost: Post!\n}\ntype Photo {\n\tid: ID!\n\ttitle: String!\n\turl: String!\n\tthumbnailUrl: String!\n\talbum: Album!\n}\ntype Post {\n\tid: ID!\n\ttitle: String!\n\tbody: String!\n\tuser: User!\n}\ntype Todo {\n\tid: ID!\n\ttitle: String!\n\tcompleted: Boolean!\n\tuser: User!\n}\ntype Album {\n\tid: ID!\n\ttitle: String!\n\tuser: User!\n}\ntype UserPaginated {\n\ttotalCount: Int, \n\tusers: [User]!\n}\ntype CommentPaginated {\n\ttotalCount: Int, \n\tcomments: [Comment]!\n}\ntype PhotoPaginated {\n\ttotalCount: Int, \n\tphotos: [Photo]!\n}\ntype PostPaginated {\n\ttotalCount: Int, \n\tposts: [Post]!\n}\ntype TodoPaginated {\n\ttotalCount: Int, \n\ttodos: [Todo]!\n}\ntype AlbumPaginated {\n\ttotalCount: Int, \n\talbums: [Album]!\n}\ninput AddressInput {\n\tstreet: String!\n\tsuite: String!\n\tcity: String!\n\tzipcode: String!\n\tgeo: GeoInput!\n}\ninput GeoInput {\n\tlat: Float!\n\tlng: Float!\n}\ninput CompanyInput {\n\tname: String!\n\tcatchPhrase: String!\n\tbs: String!\n}\n\ntype Query {\n\tgetUsers(first: Int,after: Int): UserPaginated\n\tgetUser(id: ID!): User\n\n\tgetComments(first: Int,after: Int,postId: ID): CommentPaginated\n\tgetComment(id: ID!): Comment\n\n\tgetPhotos(first: Int,after: Int,albumId: ID): PhotoPaginated\n\tgetPhoto(id: ID!): Photo\n\n\tgetPosts(first: Int,after: Int,userId: ID): PostPaginated\n\tgetPost(id: ID!): Post\n\n\tgetTodos(first: Int,after: Int,userId: ID): TodoPaginated\n\tgetTodo(id: ID!): Todo\n\n\tgetAlbums(first: Int,after: Int,userId: ID): AlbumPaginated\n\tgetAlbum(id: ID!): Album\n}\n\ntype Mutation {\n\tupdateUser(id: ID!, name: String!, username: String!, email: String!, \taddress: AddressInput!, phone: String!, website: String!, \tcompany: CompanyInput!): User!\n\tdeleteUser(id: ID!): User!\n\tinsertUser(id: ID!, name: String!, username: String!, email: String!, \taddress: AddressInput!, phone: String!, website: String!, \tcompany: CompanyInput!): User!\n\n\tupdateComment(id: ID!, name: String!, email: String!, body: String!, postId: ID!): Comment!\n\tdeleteComment(id: ID!): Comment!\n\tinsertComment(id: ID!, name: String!, email: String!, body: String!, postId: ID!): Comment!\n\n\tupdatePhoto(id: ID!, title: String!, url: String!, thumbnailUrl: String!, albumId: ID!): Photo!\n\tdeletePhoto(id: ID!): Photo!\n\tinsertPhoto(id: ID!, title: String!, url: String!, thumbnailUrl: String!, albumId: ID!): Photo!\n\n\tupdatePost(id: ID!, title: String!, body: String!, userId: ID!): Post!\n\tdeletePost(id: ID!): Post!\n\tinsertPost(id: ID!, title: String!, body: String!, userId: ID!): Post!\n\n\tupdateTodo(id: ID!, title: String!, completed: Boolean!, userId: ID!): Todo!\n\tdeleteTodo(id: ID!): Todo!\n\tinsertTodo(id: ID!, title: String!, completed: Boolean!, userId: ID!): Todo!\n\n\tupdateAlbum(id: ID!, title: String!, userId: ID!): Album!\n\tdeleteAlbum(id: ID!): Album!\n\tinsertAlbum(id: ID!, title: String!, userId: ID!): Album!\n}","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

      module.exports = doc;
    


/***/ }),

/***/ 0:
/*!***********************!*\
  !*** multi graphpack ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! graphpack */"./node_modules/graphpack/lib/server.js");


/***/ }),

/***/ "apollo-server":
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server");

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-express");

/***/ }),

/***/ "babel-loader":
/*!*******************************!*\
  !*** external "babel-loader" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-loader");

/***/ }),

/***/ "babel-preset-graphpack":
/*!*****************************************!*\
  !*** external "babel-preset-graphpack" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-preset-graphpack");

/***/ }),

/***/ "cosmiconfig":
/*!******************************!*\
  !*** external "cosmiconfig" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cosmiconfig");

/***/ }),

/***/ "friendly-errors-webpack-plugin":
/*!*************************************************!*\
  !*** external "friendly-errors-webpack-plugin" ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("friendly-errors-webpack-plugin");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),

/***/ "webpack-node-externals":
/*!*****************************************!*\
  !*** external "webpack-node-externals" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-node-externals");

/***/ })

/******/ });
//# sourceMappingURL=index.map