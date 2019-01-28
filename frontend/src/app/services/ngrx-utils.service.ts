import {Actions, ofType} from '@ngrx/effects';
import {from, Observable} from 'rxjs';
import {Action, Store} from '@ngrx/store';
import {catchError, mergeMap, withLatestFrom} from 'rxjs/operators';
import swal from 'sweetalert2';

export class NgrxUtilsService {
  public static actionToServiceToAction(params: {
    actionsObs: Actions,
    actionsToListenTo: string[],
    service: any,
    serviceMethod: string,
    payloadTransform?: (action: any, state?: any) => any,
    outputTransform?: (data: any, action?: any, state?: any) => any,
    store?: Observable<Store<any>>
  }): Observable<Action> {
    const actionString = params.actionsToListenTo[0].replace(/router|page|effect/gi, 'Service');
    return params.actionsObs
      .pipe(
        ofType(...params.actionsToListenTo),
        withLatestFrom(params.store || new Observable()),
        mergeMap(([action, state]: [{type: string, payload?: any}, any]) => {
          let payload = action.payload;
          if (params.payloadTransform) {
            payload = params.payloadTransform(action, state);
          }
          let obs: Observable<any>;
          if (payload) {
            obs = from(params.service[params.serviceMethod](payload));
          } else {
            obs = from(params.service[params.serviceMethod]());
          }
          console.log(action);
          return obs.pipe(
            mergeMap((data: any) => {
                console.log(data);
              return [
                {
                  type: actionString + ' complete',
                  payload: params.outputTransform ? params.outputTransform(data, action, state) : data
                }
              ];
            }),
            catchError((error: any) => {
              swal({
                type: 'error',
                text: error.message || error
              }).catch(swal.noop);
              return [
                {
                  type: actionString + ' failed',
                  payload: error.message
                }
              ];
            })
          );
        }),
        catchError((error: any) => {
          swal({
            type: 'error',
            text: error.message || error
          }).catch(swal.noop);
          return [
            {
              type: actionString + ' failed',
              payload: error.message
            }
          ];
        })
      );
  }

  public static actionToAction(params: {
    actionsObs: Actions,
    actionsToListenTo: string[],
    actionToDispatch: string,
    condition?: (action: any, state?: any) => boolean,
    payloadTransform?: (action: any, state?: any) => any,
    store?: Observable<Store<any>>
  }): Observable<Action> {
    return params.actionsObs
      .pipe(
        ofType(...params.actionsToListenTo),
        withLatestFrom(params.store || new Observable()),
        mergeMap(([action, state]: [{type: string, payload?: any}, any]) => {
          if (params.condition) {
            if (!params.condition(action, state)) {
              return [{
                type: 'Nothing'
              }];
            } else {
              return [{
                type: params.actionToDispatch,
                payload: params.payloadTransform ? params.payloadTransform(action, state) : action.payload
              }];
            }
          } else {
            return [{
              type: params.actionToDispatch,
              payload: params.payloadTransform ? params.payloadTransform(action, state) : action.payload
            }];
          }
        })
      );
  }
}
