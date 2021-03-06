/*
 * Angular 2 decorators and services
 */
import { Component } from 'angular2/core';
import { RouteConfig } from 'angular2/router';

import '../assets/css/main.scss';

import { Home } from './home';
import { AppState } from './app.service';
// import {RouterActive} from './router-active';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  pipes: [],
  providers: [],
  directives: [/*RouterActive*/],
  styles: [`
    body {
      margin: 0;
    }
    md-toolbar ul {
      display: inline;
      list-style-type: none;
      margin: 0;
      padding: 0;
      width: 60px;
    }
    md-toolbar li {
      display: inline;
    }
    md-toolbar li.active {
      background-color: lightgray;
    }
  `],
  template: `
    <md-toolbar color="primary">
      <span>{{ name }}</span>
      <nav>
        <ul>
          <li router-active>
            <a [routerLink]=" ['Index'] ">Index</a>
          </li>
          |
          <li router-active>
            <a [routerLink]=" ['Home'] ">Home</a>
          </li>
          |
          <li router-active>
            <a [routerLink]=" ['About'] ">About</a>
          </li>
        </ul>
      </nav>
    </md-toolbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <pre>this.appState.state = {{ appState.state | json }}</pre>
    <footer>
      WebPack Angular 2 Starter by <a [href]="url">@AngularClass</a>
      <div>
        <img [src]="angularclassLogo" width="10%">
      </div>
    </footer>
  `
})
@RouteConfig([
  { path: '/', name: 'Index', component: Home, useAsDefault: true },
  { path: '/home', name: 'Home', component: Home },
  // Async load a component using Webpack's require with es6-promise-loader and webpack `require`
  { path: '/about', name: 'About', loader: () => require('es6-promise!./about')('About') }
])
export class App {


  constructor(appState:AppState) {
    this.angularclassLogo = 'assets/img/angularclass-avatar.png';
    this.name = 'Angular 2 Webpack Starter';
    this.url = 'https://twitter.com/AngularClass';


    this.appState = appState;
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}
