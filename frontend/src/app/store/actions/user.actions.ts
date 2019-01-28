import { User } from 'src/app/models/user.model';
import { Action } from '@ngrx/store';


const USER_API = `USER_API`;

export const ROUTER_GET_USERS_FROM_API = `[${USER_API} Router] get users from API`;
export const SERVICE_GET_USERS_FROM_API_COMPLETE = `[${USER_API} Service] get users from API complete`;
export const SERVICE_GET_USERS_FROM_API_FAILED = `[${USER_API} Service] get users from API failed`;

export const SERVICE_GET_USERS_FROM_LOCAL_SERVER_COMPLETE = `[${USER_API} Service] get users from local server complete`;
export const SERVICE_GET_USERS_FROM_LOCAL_SERVER_FAILED = `[${USER_API} Service] get users from local server failed`;

export const ROUTER_GET_USER_FROM_API = `[${USER_API} Router] get user from API`;
export const SERVICE_GET_USER_FROM_API_COMPLETE = `[${USER_API} Service] get user from API complete`;
export const SERVICE_GET_USER_FROM_API_FAILED = `[${USER_API} Service] get user from API failed`;

export const USER_API_NOTHING = `[${USER_API}] nothing`;

export class RouterGetUsersFromAPIAction implements Action {
    readonly type = ROUTER_GET_USERS_FROM_API;
    constructor(public payload?: string) {}
}
export class ServiceGetUsersFromAPICompleteAction implements Action {
    readonly type = SERVICE_GET_USERS_FROM_API_COMPLETE;
    constructor(public payload: User[]) {

    }
}
export class ServiceGetUsersFromAPIFailedAction implements Action {
    readonly type = SERVICE_GET_USERS_FROM_API_FAILED;

    constructor(public payload: string) {}
}
export class ServiceGetUsersFromLocalServerCompleteAction implements Action {
    readonly type = SERVICE_GET_USERS_FROM_LOCAL_SERVER_COMPLETE;

    constructor(public payload: string) {}
}
export class ServiceGetUsersFromLocalServerFailedAction implements Action {
    readonly type = SERVICE_GET_USERS_FROM_LOCAL_SERVER_FAILED;

    constructor(public payload: string) {}
}

export class RouterGetUserFromAPIAction implements Action {
    readonly type = ROUTER_GET_USER_FROM_API;
    constructor(public payload: number) {}
}
export class ServiceGetUserFromAPICompleteAction implements Action {
    readonly type = SERVICE_GET_USER_FROM_API_COMPLETE;
    constructor(public payload: User) {

    }
}
export class ServiceGetUserFromAPIFailedAction implements Action {
    readonly type = SERVICE_GET_USER_FROM_API_FAILED;

    constructor(public payload: string) {}
}
export class UserAPINothingAction implements Action {
    readonly type = USER_API_NOTHING;

    constructor(public payload?: string) {}
}

export type UserActions =
    | RouterGetUsersFromAPIAction
    | ServiceGetUsersFromAPICompleteAction
    | ServiceGetUsersFromAPIFailedAction

    | ServiceGetUsersFromLocalServerCompleteAction
    | ServiceGetUsersFromLocalServerFailedAction

    | RouterGetUserFromAPIAction
    | ServiceGetUserFromAPICompleteAction
    | ServiceGetUserFromAPIFailedAction
    
    | UserAPINothingAction
    ;
