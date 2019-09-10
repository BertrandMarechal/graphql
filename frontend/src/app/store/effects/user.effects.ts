import { Injectable } from '@angular/core';
import { RouterUtilsService, RouteNavigationParams } from 'src/app/services/router-utils.service';
import { Observable, from } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as UserActions from '../actions/user.actions';
import * as fromUser from '../reducers/user.reducers';
import { withLatestFrom, mergeMap, catchError } from 'rxjs/operators';
import { JsonPlaceholderService } from 'src/app/services/json-placeholder.service';
import { User } from 'src/app/models/user.model';
import { NgrxUtilsService } from 'src/app/services/ngrx-utils.service';
import { LocalGraphqlService } from 'src/app/services/local-graphql.service';

@Injectable()
export class UserEffects {
  @Effect()
  getUsersFromLocalServer: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.PAGE_GET_USERS_FROM_LOCAL_SERVER),
      mergeMap(() => {
        return from(
          this.localGraphqlService.query('{usersPaginated: getUsers{totalCount users{id name}}}')
        ).pipe(
          mergeMap(({ usersPaginated: { totalCount, users } }: { usersPaginated: { totalCount: number, users: User[] } }) => {
            return [
              {
                type: UserActions.SERVICE_GET_USERS_FROM_LOCAL_SERVER_COMPLETE,
                payload: users
              },
            ];
          }),
          catchError((error: String) => {
            return [
              {
                type: UserActions.SERVICE_GET_USERS_FROM_LOCAL_SERVER_FAILED,
                payload: error
              },
            ];
          })
        );
      })
    );

  @Effect()
  queryGraphQL: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.PAGE_CALL_GRAPHQL),
      mergeMap((action: UserActions.PageCallGraphQLAction) => {
        return from(
          this.localGraphqlService.query(action.payload.query, action.payload.variables, action.payload.operationName)
        ).pipe(
          mergeMap((data: any) => {
            return [
              {
                type: action.payload.outputAction,
                payload: data
              },
            ];
          }),
          catchError((error: String) => {
            return [
              {
                type: action.payload.outputAction.replace(/ complete$/, ' failed'),
                payload: error
              },
            ];
          })
        );
      })
    );
  @Effect()
  addUser: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.PAGE_ADD_USER),
      mergeMap((action: UserActions.PageAddUserAction) => {
        return from(
          this.localGraphqlService.mutation(
            `mutation addUser($name: String!, $username: String!){user: insertUser(name: $name, username: $username){id name username}}`,
            action.payload)
        ).pipe(
          mergeMap((data: { user: User }) => {
            return [
              {
                type: UserActions.SERVICE_ADD_USER_COMPLETE,
                payload: data.user
              },
            ];
          }),
          catchError((error: String) => {
            return [
              {
                type: UserActions.SERVICE_ADD_USER_FAILED,
                payload: error
              },
            ];
          })
        );
      })
    );


  constructor(
    public store: Store<fromUser.FeatureState>,
    public actions$: Actions,
    public jsonPlaceholderService: JsonPlaceholderService,
    public localGraphqlService: LocalGraphqlService
  ) { }
}
