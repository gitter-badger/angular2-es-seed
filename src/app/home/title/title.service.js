import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

@Injectable()
export class Title {
  value = 'Angular 2';
  constructor(http: Http) {
    this.http = http;
  }

  getData() {
    console.log('Title#getData(): Get Data');
    // return this.http.get('/assets/data.json')
    // .map(res => res.json());
    return {
      value: 'AngularClass'
    };
  }

}
