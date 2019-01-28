import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromUser from '../../store/reducers/user.reducers';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  user$: Observable<fromUser.State>;

  constructor(private store: Store<fromUser.FeatureState>) { }

  ngOnInit() {
    this.user$ = this.store.select('user');
  }

}
