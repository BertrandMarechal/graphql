import { Component, OnInit, Input } from '@angular/core';
import { Todo } from 'src/app/models/user.model';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent {
  @Input() todos: Todo[];
}
