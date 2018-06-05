import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NavItem } from '../../shared/head/nav-item.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  navItems: NavItem[] = [
    { label: '考试', link: '/admin/contest' },
    { label: '学生', link: '/admin/student' },
    { label: '教师', link: '/admin/teacher' },
    { label: '设置', link: '/admin/settings' }
  ];

  constructor() {}

  ngOnInit() {}
}
