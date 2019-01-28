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
  // @Effect()
  // navigateToUsers: Observable<Action> = RouterUtilsService.handleNavigationWithParams(
  //   'users',
  //   this.actions$
  // ).pipe(
  //   mergeMap((action: RouteNavigationParams) => {
  //     console.log(action);
  //     return from(
  //       this.jsonPlaceholderService.getUsers()
  //     ).pipe(
  //       mergeMap((users: User[]) => {
  //         console.log(users);
  //         return [
  //           {
  //             type: UserActions.SERVICE_GET_USERS_FROM_API_COMPLETE,
  //             payload: users
  //           },
  //         ];
  //       }),
  //       catchError((error: String) => {
  //         return [
  //           {
  //             type: UserActions.SERVICE_GET_USERS_FROM_API_FAILED,
  //             payload: error
  //           },
  //         ];
  //       })
  //     );
  //   })
  // );
  // @Effect()
  // navigateToUser: Observable<Action> = RouterUtilsService.handleNavigationWithParams(
  //   'users/:id',
  //   this.actions$
  // ).pipe(
  //   mergeMap((action: RouteNavigationParams) => {

  //     if (!action.params || !action.params.id || !+action.params.id) {
  //       return [{
  //         type: UserActions.USER_API_NOTHING
  //       }];
  //     }
  //     return from(
  //       this.jsonPlaceholderService.getUser(+action.params.id)
  //     ).pipe(
  //       mergeMap((user: User) => {
  //         console.log(user);
  //         return [
  //           {
  //             type: UserActions.SERVICE_GET_USER_FROM_API_COMPLETE,
  //             payload: user
  //           },
  //         ];
  //       }),
  //       catchError((error: String) => {
  //         return [
  //           {
  //             type: UserActions.SERVICE_GET_USER_FROM_API_FAILED,
  //             payload: error
  //           },
  //         ];
  //       })
  //     );
  //   })
  // );
  @Effect()
  navigateToUsers: Observable<Action> = RouterUtilsService.handleNavigationWithParams(
    'users',
    this.actions$
  ).pipe(
    mergeMap((action: RouteNavigationParams) => {
      return [
        {
          type: UserActions.SERVICE_GET_USERS_FROM_API_COMPLETE
        },
      ];
    })
  );
  @Effect()
  getUsersFromLocalServer: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.SERVICE_GET_USERS_FROM_API_COMPLETE),
      mergeMap(() => {
        return from(
          this.localGraphqlService.getUsers()
        ).pipe(
          mergeMap((users: User[]) => {
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


  constructor(
    public store: Store<fromUser.FeatureState>,
    public actions$: Actions,
    public jsonPlaceholderService: JsonPlaceholderService,
    public localGraphqlService: LocalGraphqlService
  ) { }
}
