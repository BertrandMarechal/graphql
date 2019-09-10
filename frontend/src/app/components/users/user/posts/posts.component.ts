import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/models/user.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent {
  @Input() posts: Post[];
}
