import { AppState } from './app.reducers';
import { User } from 'src/app/models/user.model';
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
}

const initialState: State = {
    users: null,
    users2: null,
    gettingUsers: false,
    user: null,
    gettingUser: false
};

export function userReducers(
    state = initialState,
    action: UserActions.UserActions,
) {
    console.log(action);
    switch (action.type) {
        case UserActions.ROUTER_GET_USERS_FROM_API:
            return {
                ...state,
                gettingUsers: true
            };
        case UserActions.SERVICE_GET_USERS_FROM_API_COMPLETE:
            console.log(action);
            return {
                ...state,
                gettingUsers: false,
                users: action.payload
            };
        case UserActions.SERVICE_GET_USERS_FROM_API_FAILED:
            return {
                ...state,
                gettingUsers: false
            };
        case UserActions.SERVICE_GET_USERS_FROM_LOCAL_SERVER_COMPLETE:
            console.log(action);
            return {
                ...state,
                gettingUsers: false,
                users2: action.payload
            };
        case UserActions.SERVICE_GET_USERS_FROM_LOCAL_SERVER_FAILED:
            return {
                ...state,
                gettingUsers: false
            };
        case UserActions.ROUTER_GET_USER_FROM_API:
            return {
                ...state,
                gettingUser: true
            };
        case UserActions.SERVICE_GET_USER_FROM_API_COMPLETE:
            return {
                ...state,
                gettingUser: false,
                user: action.payload
            };
        case UserActions.SERVICE_GET_USER_FROM_API_FAILED:
            return {
                ...state,
                gettingUser: false
            };
        default:
            break;
    }
}
