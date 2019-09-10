import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Album, Photo } from 'src/app/models/user.model';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent {
  @Input() albums: Album[];
  @Input() album: Album;
  @Input() photos: Photo[];
  @Output() getAlbum = new EventEmitter<number>();
}
