import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalGraphqlService {

  constructor(public http: HttpClient) { }

  // async getUsers(): Promise<User[]> {
  //   return new Promise((resolve, reject) => {
  //     const alias = 'users';
  //     const fields = ['id', 'name'];
  //     const method = 'users';

  //     this.http.post('http://localhost:4000', {
  //       valiables: [],
  //       operationName: null,
  //       query: `{${alias}: ${method}{${fields.join(' ')}}}`
  //     }).subscribe((data: { data: any }) => {
  //       console.log(data.data[alias]);
  //       resolve(data.data[alias]);
  //     });
  //   });
  // }

  async getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      const alias = 'channels';
      const fields = [
        'id',
        'name',
        'channelType',
        // 'channelStatusId',
        // 'sender',
        // 'authKey',
        // 'host',
        // 'lastStarted',
        // 'lastPolled',
        'iterationRate',
      ];
      const method = 'channels';

      this.http.post('http://localhost:4000', {
        valiables: [],
        operationName: null,
        query: `{${alias}: ${method}{${fields.join(' ')}}}`
      }).subscribe((data: { data: any }) => {
        console.log(data.data[alias]);
        resolve(data.data[alias]);
      });
    });
  }
}
