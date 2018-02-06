import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  navLinks = [{
    path: 'publisher',
    label: 'Publisher'
  }, {
    path: 'publisher2',
    label: 'Publisher2'
  }];
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
