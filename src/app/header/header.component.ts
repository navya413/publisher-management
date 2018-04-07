import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  navLinks = [{
    path: 'publisher-stats',
    label: 'Publisher Stats'
  }, {
    path: 'publisher-management',
    label: 'Publisher Management'
  }, {
    path: 'publisher-feeds',
    label: 'Publisher Feeds'
  }];
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
