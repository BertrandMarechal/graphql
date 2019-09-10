import { AppState } from './app.reducers';
import { User, Album, Photo, Todo, Post } from 'src/app/models/user.model';
import * as UserActions from '../actions/user.actions';

export interface FeatureState extends AppState {
    user: State;
}

export interface State {
    users: User[];
    users2: User[];
    gettingUsers: boolean;
    user: User;
    gettingUser: boolean;
    albums: Album[];
    gettingAlbums: boolean;
    album: Album;
    gettingAlbum: boolean;
    todos: Todo[];
    gettingTodos: boolean;
    posts: Post[];
    gettingPosts: boolean;
    photos: Photo[];
    gettingPhotos: boolean;
    photo: Photo[];
    gettingPhoto: boolean;
}

const initialState: State = {
    users: null,
    users2: null,
    gettingUsers: false,
    user: null,
    gettingUser: false,
    albums: null,
    gettingAlbums: false,
    album: null,
    gettingAlbum: false,
    todos: null,
    gettingTodos: false,
    posts: null,
    gettingPosts: false,
    photos: null,
    gettingPhotos: false,
    photo: null,
    gettingPhoto: false
};

export function userReducers(
    state = initialState,
    action: UserActions.UserActions,
) {
    switch (action.type) {
        case UserActions.PAGE_GET_USERS_FROM_LOCAL_SERVER:
            return {
                ...state,
                gettingUsers: true
            };
        case UserActions.SERVICE_GET_USERS_FROM_LOCAL_SERVER_COMPLETE:
            return {
                ...state,
                gettingUsers: false,
                users: (action as UserActions.ServiceGetUsersFromLocalServerCompleteAction).payload.usersPaginated.users
            };
        case UserActions.SERVICE_GET_USERS_FROM_LOCAL_SERVER_FAILED:
            return {
                ...state,
                gettingUsers: false
            };
        case UserActions.PAGE_ADD_USER:
            return {
                ...state,
                savingUsers: true
            };
        case UserActions.SERVICE_ADD_USER_COMPLETE:
            return {
                ...state,
                savingUsers: false,
                user: (action as UserActions.ServiceAddUserCompleteAction).payload.user
            };
        case UserActions.SERVICE_ADD_USER_FAILED:
            return {
                ...state,
                savingUsers: false
            };
        case UserActions.SERVICE_GET_USER_FROM_LOCAL_SERVER_COMPLETE:
            return {
                ...state,
                gettingUser: false,
                user: (action as UserActions.ServiceGetUserFromLocalServerCompleteAction).payload.user
            };
        case UserActions.SERVICE_GET_USER_FROM_LOCAL_SERVER_FAILED:
            return {
                ...state,
                gettingUser: false
            };
        case UserActions.SERVICE_GET_USER_ALBUMS_FROM_LOCAL_SERVER_COMPLETE:
            return {
                ...state,
                gettingAlbums: false,
                albums: (action as UserActions.ServiceGetUserAlbumsFromLocalServerCompleteAction).payload.albumsPaginated.albums
            };
        case UserActions.SERVICE_GET_USER_ALBUMS_FROM_LOCAL_SERVER_FAILED:
            return {
                ...state,
                gettingAlbums: false
            };
        case UserActions.SERVICE_GET_USER_TODOS_FROM_LOCAL_SERVER_COMPLETE:
            return {
                ...state,
                gettingTodos: false,
                todos: (action as UserActions.ServiceGetUserTodosFromLocalServerCompleteAction).payload.todosPaginated.todos
            };
        case UserActions.SERVICE_GET_USER_TODOS_FROM_LOCAL_SERVER_FAILED:
            return {
                ...state,
                gettingTodos: false
            };
        case UserActions.SERVICE_GET_USER_POSTS_FROM_LOCAL_SERVER_COMPLETE:
            return {
                ...state,
                gettingPosts: false,
                posts: (action as UserActions.ServiceGetUserPostsFromLocalServerCompleteAction).payload.postsPaginated.posts
            };
        case UserActions.SERVICE_GET_USER_POSTS_FROM_LOCAL_SERVER_FAILED:
            return {
                ...state,
                gettingPosts: false
            };
        case UserActions.SERVICE_GET_USER_ALBUM_FROM_LOCAL_SERVER_COMPLETE:
            return {
                ...state,
                gettingAlbum: false,
                album: (action as UserActions.ServiceGetUserAlbumFromLocalServerCompleteAction).payload.album
            };
        case UserActions.SERVICE_GET_USER_ALBUM_FROM_LOCAL_SERVER_FAILED:
            return {
                ...state,
                gettingAlbum: false
            };
        case UserActions.SERVICE_GET_USER_ALBUM_PHOTOS_FROM_LOCAL_SERVER_COMPLETE:
            return {
                ...state,
                gettingPhotos: false,
                photos: (action as UserActions.ServiceGetUserAlbumPhotosFromLocalServerCompleteAction).payload.photosPaginated.photos
            };
        case UserActions.SERVICE_GET_USER_ALBUM_PHOTOS_FROM_LOCAL_SERVER_FAILED:
            return {
                ...state,
                gettingPhotos: false
            };
        default:
            break;
    }
    return state;
}
