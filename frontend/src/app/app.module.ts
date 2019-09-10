import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './store/reducers/app.reducers';
import { userReducers } from './store/reducers/user.reducers';
import { UserEffects } from './store/effects/user.effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/users/user/user.component';
import { AlbumsComponent } from './components/users/user/albums/albums.component';
import { AlbumComponent } from './components/users/user/albums/album/album.component';
import { PhotoComponent } from './components/users/user/albums/album/photo/photo.component';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import { TodosComponent } from './components/users/user/todos/todos.component';
import { PostsComponent } from './components/users/user/posts/posts.component';
import { PostComponent } from './components/users/user/posts/post/post.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserComponent,
    AlbumsComponent,
    AlbumComponent,
    PhotoComponent,
    CreateUserComponent,
    TodosComponent,
    PostsComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    StoreModule.forFeature('user', userReducers),
    EffectsModule.forFeature([
      UserEffects
    ]),
    StoreRouterConnectingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
