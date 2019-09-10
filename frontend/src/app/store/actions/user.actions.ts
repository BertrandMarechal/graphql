import { User, Album, Photo, Todo, Post } from 'src/app/models/user.model';
import { Action } from '@ngrx/store';


const USER_API = `USER_API`;

export const PAGE_CALL_GRAPHQL = `[${USER_API} Page] call graphql`;

export const PAGE_GET_USERS_FROM_LOCAL_SERVER = `[${USER_API} Page] get users from local server`;
export const SERVICE_GET_USERS_FROM_LOCAL_SERVER_COMPLETE = `[${USER_API} Service] get users from local server complete`;
export const SERVICE_GET_USERS_FROM_LOCAL_SERVER_FAILED = `[${USER_API} Service] get users from local server failed`;

export const PAGE_ADD_USER = `[${USER_API} Page] add user`;
export const SERVICE_ADD_USER_COMPLETE = `[${USER_API} Service] add user complete`;
export const SERVICE_ADD_USER_FAILED = `[${USER_API} Service] add user failed`;

export const SERVICE_GET_USER_FROM_LOCAL_SERVER_COMPLETE = `[${USER_API} Service] get user from local server complete`;
export const SERVICE_GET_USER_FROM_LOCAL_SERVER_FAILED = `[${USER_API} Service] get user from local server failed`;

export const SERVICE_GET_USER_ALBUMS_FROM_LOCAL_SERVER_COMPLETE = `[${USER_API} Service] get user albums from local server complete`;
export const SERVICE_GET_USER_ALBUMS_FROM_LOCAL_SERVER_FAILED = `[${USER_API} Service] get user albums from local server failed`;

export const SERVICE_GET_USER_TODOS_FROM_LOCAL_SERVER_COMPLETE = `[${USER_API} Service] get user todos from local server complete`;
export const SERVICE_GET_USER_TODOS_FROM_LOCAL_SERVER_FAILED = `[${USER_API} Service] get user todos from local server failed`;

export const SERVICE_GET_USER_POSTS_FROM_LOCAL_SERVER_COMPLETE = `[${USER_API} Service] get user posts from local server complete`;
export const SERVICE_GET_USER_POSTS_FROM_LOCAL_SERVER_FAILED = `[${USER_API} Service] get user posts from local server failed`;

export const SERVICE_GET_USER_ALBUM_FROM_LOCAL_SERVER_COMPLETE = `[${USER_API} Service] get user album from local server complete`;
export const SERVICE_GET_USER_ALBUM_FROM_LOCAL_SERVER_FAILED = `[${USER_API} Service] get user album from local server failed`;

export const SERVICE_GET_USER_ALBUM_PHOTOS_FROM_LOCAL_SERVER_COMPLETE =
    `[${USER_API} Service] get user album photos from local server complete`;
export const SERVICE_GET_USER_ALBUM_PHOTOS_FROM_LOCAL_SERVER_FAILED =
    `[${USER_API} Service] get user album photos from local server failed`;

export const USER_API_NOTHING = `[${USER_API}] nothing`;

export class PageCallGraphQLAction implements Action {
    readonly type = PAGE_CALL_GRAPHQL;
    constructor(public payload: {
        outputAction: string;
        query: string;
        variables?: any
        operationName?: string
    }) { }
}
export class PageGetUsersFromLocalServerAction implements Action {
    readonly type = PAGE_GET_USERS_FROM_LOCAL_SERVER;

    constructor(public payload?: string) { }
}
export class ServiceGetUsersFromLocalServerCompleteAction implements Action {
    readonly type = SERVICE_GET_USERS_FROM_LOCAL_SERVER_COMPLETE;

    constructor(public payload: { usersPaginated: { totalCount: number, users: User[] } }) { }
}
export class ServiceGetUsersFromLocalServerFailedAction implements Action {
    readonly type = SERVICE_GET_USERS_FROM_LOCAL_SERVER_FAILED;

    constructor(public payload: string) { }
}
export class PageAddUserAction implements Action {
    readonly type = PAGE_ADD_USER;

    constructor(public payload: { name: string, username: string }) { }
}
export class ServiceAddUserCompleteAction implements Action {
    readonly type = SERVICE_ADD_USER_COMPLETE;

    constructor(public payload: { user: User }) { }
}
export class ServiceAddUserFailedAction implements Action {
    readonly type = SERVICE_ADD_USER_FAILED;

    constructor(public payload: string) { }
}
export class ServiceGetUserFromLocalServerCompleteAction implements Action {
    readonly type = SERVICE_GET_USER_FROM_LOCAL_SERVER_COMPLETE;

    constructor(public payload: { user: User }) { }
}
export class ServiceGetUserFromLocalServerFailedAction implements Action {
    readonly type = SERVICE_GET_USER_FROM_LOCAL_SERVER_FAILED;

    constructor(public payload: string) { }
}
export class ServiceGetUserAlbumsFromLocalServerCompleteAction implements Action {
    readonly type = SERVICE_GET_USER_ALBUMS_FROM_LOCAL_SERVER_COMPLETE;

    constructor(public payload: { albumsPaginated: { totalCount: number, albums: Album[] } }) { }
}
export class ServiceGetUserAlbumsFromLocalServerFailedAction implements Action {
    readonly type = SERVICE_GET_USER_ALBUMS_FROM_LOCAL_SERVER_FAILED;

    constructor(public payload: string) { }
}
export class ServiceGetUserTodosFromLocalServerCompleteAction implements Action {
    readonly type = SERVICE_GET_USER_TODOS_FROM_LOCAL_SERVER_COMPLETE;

    constructor(public payload: { todosPaginated: { totalCount: number, todos: Todo[] } }) { }
}
export class ServiceGetUserTodosFromLocalServerFailedAction implements Action {
    readonly type = SERVICE_GET_USER_TODOS_FROM_LOCAL_SERVER_FAILED;

    constructor(public payload: string) { }
}
export class ServiceGetUserPostsFromLocalServerCompleteAction implements Action {
    readonly type = SERVICE_GET_USER_POSTS_FROM_LOCAL_SERVER_COMPLETE;

    constructor(public payload: { postsPaginated: { totalCount: number, posts: Post[] } }) { }
}
export class ServiceGetUserPostsFromLocalServerFailedAction implements Action {
    readonly type = SERVICE_GET_USER_POSTS_FROM_LOCAL_SERVER_FAILED;

    constructor(public payload: string) { }
}
export class ServiceGetUserAlbumFromLocalServerCompleteAction implements Action {
    readonly type = SERVICE_GET_USER_ALBUM_FROM_LOCAL_SERVER_COMPLETE;

    constructor(public payload: { album: Album }) { }
}
export class ServiceGetUserAlbumFromLocalServerFailedAction implements Action {
    readonly type = SERVICE_GET_USER_ALBUM_FROM_LOCAL_SERVER_FAILED;

    constructor(public payload: string) { }
}
export class ServiceGetUserAlbumPhotosFromLocalServerCompleteAction implements Action {
    readonly type = SERVICE_GET_USER_ALBUM_PHOTOS_FROM_LOCAL_SERVER_COMPLETE;

    constructor(public payload: { photosPaginated: { totalCount: number, photos: Photo[] } }) { }
}
export class ServiceGetUserAlbumPhotosFromLocalServerFailedAction implements Action {
    readonly type = SERVICE_GET_USER_ALBUM_PHOTOS_FROM_LOCAL_SERVER_FAILED;

    constructor(public payload: string) { }
}

export class UserAPINothingAction implements Action {
    readonly type = USER_API_NOTHING;

    constructor(public payload?: string) { }
}

export type UserActions =
    | PageCallGraphQLAction

    | PageGetUsersFromLocalServerAction
    | ServiceGetUsersFromLocalServerCompleteAction
    | ServiceGetUsersFromLocalServerFailedAction

    | ServiceGetUserFromLocalServerCompleteAction
    | ServiceGetUserFromLocalServerFailedAction

    | ServiceGetUserAlbumsFromLocalServerCompleteAction
    | ServiceGetUserAlbumsFromLocalServerFailedAction

    | ServiceGetUserAlbumFromLocalServerCompleteAction
    | ServiceGetUserAlbumFromLocalServerFailedAction

    | ServiceGetUserTodosFromLocalServerCompleteAction
    | ServiceGetUserTodosFromLocalServerFailedAction

    | ServiceGetUserPostsFromLocalServerCompleteAction
    | ServiceGetUserPostsFromLocalServerFailedAction

    | ServiceGetUserAlbumPhotosFromLocalServerCompleteAction
    | ServiceGetUserAlbumPhotosFromLocalServerFailedAction

    | PageAddUserAction
    | ServiceAddUserCompleteAction
    | ServiceAddUserFailedAction

    | UserAPINothingAction
    ;
