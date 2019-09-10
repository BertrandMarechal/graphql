import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromUser from '../../store/reducers/user.reducers';
import * as UserActions from '../../store/actions/user.actions';
import { Observable } from 'rxjs';
import { fields } from 'src/app/models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  user$: Observable<fromUser.State>;
  showCreateUser: boolean;
  userFields = fields.User.filter(prop => prop !== 'id').map(name => ({name: name, active: false}));

  constructor(private store: Store<fromUser.FeatureState>) { }

  ngOnInit() {
    this.user$ = this.store.select('user');
    this.store.dispatch(new UserActions.PageCallGraphQLAction({
      outputAction: UserActions.SERVICE_GET_USERS_FROM_LOCAL_SERVER_COMPLETE,
      query: `{usersPaginated: getUsers{totalCount users{id ${this.userFields.filter(({active}) => active).map(({name}) => name)}}}}`
    }));
  }

  onChangeFields(checked: any, index: number) {
    this.userFields[index].active = !this.userFields[index].active;
    const selectedFieldsCount = this.userFields.filter(({active}) => active);
    if (selectedFieldsCount) {
      this.store.dispatch(new UserActions.PageCallGraphQLAction({
        outputAction: UserActions.SERVICE_GET_USERS_FROM_LOCAL_SERVER_COMPLETE,
        query: `{usersPaginated: getUsers{totalCount users{id ${this.userFields.filter(({active}) => active).map(({name}) => name)}}}}`
      }));
    }
  }

  onSave({name, username}) {
    this.store.dispatch(new UserActions.PageAddUserAction({
      name: name,
      username: username
    }));
  }
}
