import {ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ROUTER_NAVIGATION, RouterNavigationAction} from '@ngrx/router-store';
import {catchError, filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {ofType} from '@ngrx/effects';

export interface RouteNavigationParams {
  params: { [option: string]: string };
  queryParams: { [option: string]: string };
  url: string;
  targetUrl: string;
}

export class RouterUtilsService {
  static isSegmentAtLevel(segment: string, level: number, route: ActivatedRouteSnapshot) {
    if (level === 0) {
      return route.firstChild.routeConfig.path === segment;
    } else {
      return RouterUtilsService.isSegmentAtLevel(segment, level - 1, route.firstChild);
    }
  }

  static getSegment(segment: string[], route: RouterNavigationAction | ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let firstChild = (<ActivatedRouteSnapshot>route).firstChild;
    if (!firstChild) {
      if ((<RouterNavigationAction>route).payload) {
        firstChild = (<RouterNavigationAction>route).payload.routerState.root.firstChild;
      }
    }
    if (segment.length === 1 && firstChild && firstChild.routeConfig.path === segment[0]) {
      return firstChild;
    } else {
      const subSegment = [...segment];
      if (firstChild && firstChild.routeConfig.path === '') {
        return RouterUtilsService.getSegment(subSegment, firstChild);
      } else if (firstChild && segment.length > 1) {
        subSegment.splice(0, 1);
        return RouterUtilsService.getSegment(subSegment, firstChild);
      } else {
        return null;
      }
    }
  }

  static handleNavigation(segment: string, actions: any, store: any, callback: (a: ActivatedRouteSnapshot, state: any) => Observable<any>) {
    const nav = actions.pipe(
      ofType(ROUTER_NAVIGATION),
      map((x: RouterNavigationAction) => {
        console.log(segment, x);
        return RouterUtilsService.getSegment(segment.split('/'), x);
      }),
      filter(Boolean)
    );
    return nav.pipe(
      withLatestFrom(store),
      switchMap(a => callback(a[0], a[1])),
      catchError((e) => {
        console.log('Network error', e);
        return of();
      })
    );
  }

  static newHandleNavigation(
    segment: string,
    actions: any,
    store: any,
    callback: (a: { [option: string]: string }, state: any) => Observable<any>) {
    const url = segment[0] === '/' ? segment : '/' + segment;
    const nav = actions.pipe(
      ofType(ROUTER_NAVIGATION),
      map((x: RouterNavigationAction) => {
        if (x.payload.event.url) {
          const urlSplit = url.split('/');
          const urlEventSplit = x.payload.event.url.split('/');
          const returnObject: { [option: string]: string } = {};
          let ok = true;
          for (let i = 0; i < urlSplit.length && ok; i++) {
            const item = urlSplit[i];
            if (item[0] === ':') {
              returnObject[item.substring(1)] = urlEventSplit[i];
            } else {
              ok = item === urlEventSplit[i];
            }
          }

          return ok ? returnObject : null;
        }
        return null;
      }),
      filter(Boolean)
    );

    return nav.pipe(
      withLatestFrom(store),
      switchMap(a => callback(a[0], a[1])),
      catchError(e => {
        console.log('Network error', e);
        return of();
      })
    );
  }

  static superNewHandleNavigation(segment: string, actions: any): Observable<{ [option: string]: string }> {
    const url = segment[0] === '/' ? segment : '/' + segment;
    return actions.pipe(
      ofType(ROUTER_NAVIGATION),
      map((x: RouterNavigationAction) => {
        if (x.payload.event.url) {
          const urlSplit = url.split('/');
          const urlEventSplit = x.payload.event.url.split('/');
          const returnObject: { [option: string]: string } = {};
          let ok = true;
          for (let i = 0; i < urlSplit.length && ok; i++) {
            const item = urlSplit[i];
            if (item[0] === ':') {
              returnObject[item.substring(1)] = urlEventSplit[i];
            } else {
              ok = item === urlEventSplit[i];
            }
          }

          return ok ? returnObject : null;
        }
        return null;
      }),
      filter(Boolean)
    );
  }

  static handleNavigationWithParams(segments: string | string[], actions: any):
    Observable<RouteNavigationParams> {
    segments = Array.isArray(segments) ? segments : [segments];
    const urls = segments.map(segment => segment[0] === '/' ? segment : '/' + segment);
    return actions.pipe(
      ofType(ROUTER_NAVIGATION),
      map((x: RouterNavigationAction) => {
        if (x.payload.event.url) {
          let returnObject: RouteNavigationParams = null;
          let ok;
          for (let i = 0; i < urls.length && !ok; i++) {
            ok = true;
            const url = urls[i];
            const urlSplit = url.split('?')[0].split('/');
            const urlEventSplit = x.payload.event.url.split('?')[0].split('/');
            const returnObjectParams: { [option: string]: string } = {};
            for (let j = 0; j < urlSplit.length && ok; j++) {
              const item = urlSplit[j];
              if (item[0] === ':') {
                returnObjectParams[item.substring(1)] = urlEventSplit[j];
              } else {
                ok = item === '*' || item === urlEventSplit[j];
              }
            }
            const paramsSplit = x.payload.event.url.split('?')[1] ? x.payload.event.url.split('?')[1].split('&') : [];
            returnObject = {
              url: url,
              targetUrl: x.payload.event.url,
              params: returnObjectParams,
              queryParams: paramsSplit
                .map(y => y.split('='))
                .reduce((agg, [name, value]: [string, string]) => {
                  agg[name] = value;
                  return agg;
                }, {})
            };
          }
          return ok ? returnObject : null;
        }
        return null;
      }),
      filter(Boolean)
    );
  }
}
