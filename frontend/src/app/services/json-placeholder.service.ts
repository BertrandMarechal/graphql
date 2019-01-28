import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonPlaceholderService {

  constructor(public http: HttpClient) { }

  async getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.http.get('https://jsonplaceholder.typicode.com/users').subscribe(resolve);
    });
  }
  async getUser(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      this.http.get(`https://jsonplaceholder.typicode.com/users/${id}`).subscribe(resolve);
    });
  }
}
