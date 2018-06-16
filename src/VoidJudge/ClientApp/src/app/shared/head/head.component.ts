import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { NavItem } from './nav-item.model';
import { StudentUser } from '../../core/auth/user.model';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {
  @Input() navItems: NavItem[];

  get group() {
    const user = <StudentUser>this.authService.user;
    if (user) {
      return user.group;
    } else {
      return '';
    }
  }

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
