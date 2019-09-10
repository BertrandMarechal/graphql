import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalGraphqlService {

  constructor(public http: HttpClient) { }

  async getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      const alias = 'getUsers';
      const fields = [
        'id',
        'name'
      ];
      const method = 'users';

      this.http.post('http://localhost:4000', {
        valiables: [],
        operationName: null,
        query: `{${alias}: ${method}{${fields.join(' ')}}}`
      }).subscribe((data: { data: any }) => {
        resolve(data.data[alias]);
      });
    });
  }
  async query(query: string, variables: Object = {}, operationName = null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:4000', {
        variables: variables,
        operationName: operationName,
        query: query
      }).subscribe(({data}: { data: any }) => {
        resolve(data);
      });
    });
  }
  async mutation(query: string, variables: Object = {}, operationName = null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:4000', {
        variables: variables,
        operationName: operationName,
        query: query
      }).subscribe(({data}: { data: any }) => {
        resolve(data);
      });
    });
  }
}
