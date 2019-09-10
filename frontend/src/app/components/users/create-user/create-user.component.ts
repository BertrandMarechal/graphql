import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  @Output() save = new EventEmitter<{name: string, username: string}>();
  @Output() cancel = new EventEmitter();
  username: string;
  name: string;
}
