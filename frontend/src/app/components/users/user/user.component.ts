import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromUser from '../../../store/reducers/user.reducers';
import * as UserActions from '../../../store/actions/user.actions';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user$: Observable<fromUser.State>;

  constructor(private store: Store<fromUser.FeatureState> , private route: ActivatedRoute) { }

  ngOnInit() {
    this.user$ = this.store.select('user');

    this.route.params.subscribe((params) => {

      this.store.dispatch(new UserActions.PageCallGraphQLAction({
        outputAction: UserActions.SERVICE_GET_USER_FROM_LOCAL_SERVER_COMPLETE,
        query: `query getUser($id: ID!){user: getUser(id: $id){id name}}`,
        variables: {id: +params.id}
      }));
      this.store.dispatch(new UserActions.PageCallGraphQLAction({
        outputAction: UserActions.SERVICE_GET_USER_ALBUMS_FROM_LOCAL_SERVER_COMPLETE,
        query: `query getAlbumsForUser($id: ID!){albumsPaginated: getAlbums(userId:$id){totalCount albums{id title}}}`,
        variables: {id: +params.id}
      }));
      this.store.dispatch(new UserActions.PageCallGraphQLAction({
        outputAction: UserActions.SERVICE_GET_USER_TODOS_FROM_LOCAL_SERVER_COMPLETE,
        query: `query getTodosForUser($id: ID!){todosPaginated: getTodos(userId:$id){totalCount todos{id title completed}}}`,
        variables: {id: +params.id}
      }));
      this.store.dispatch(new UserActions.PageCallGraphQLAction({
        outputAction: UserActions.SERVICE_GET_USER_POSTS_FROM_LOCAL_SERVER_COMPLETE,
        query: `query getPostsForUser($id: ID!){
          postsPaginated: getPosts(userId:$id){totalCount posts{id title body comments{id body email name}}}
        }`,
        variables: {id: +params.id}
      }));
    });
  }

  onGetAlbum(id: number) {
    this.store.dispatch(new UserActions.PageCallGraphQLAction({
      outputAction: UserActions.SERVICE_GET_USER_ALBUM_FROM_LOCAL_SERVER_COMPLETE,
      query: `query getAlbum($id: ID!){album: getAlbum(id: $id){id title}}`,
      variables: {id: +id}
    }));
    this.store.dispatch(new UserActions.PageCallGraphQLAction({
      outputAction: UserActions.SERVICE_GET_USER_ALBUM_PHOTOS_FROM_LOCAL_SERVER_COMPLETE,
      query: `query getPhotosForAlbum($id: ID!){photosPaginated: getPhotos(albumId:$id){totalCount photos{id title url thumbnailUrl}}}`,
      variables: {id: +id}
    }));
  }
}
