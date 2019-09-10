import { Component, OnInit, Input } from '@angular/core';
import { Album, Photo } from 'src/app/models/user.model';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent {
  @Input() album: Album;
  @Input() photos: Photo[];
}
