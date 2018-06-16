import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NavItem } from '../../shared/head/nav-item.model';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  navItems: NavItem[] = [
    { label: '考试', link: '/teacher/contest' },
    { label: '设置', link: '/teacher/settings' }
  ];

  constructor() {}

  ngOnInit() {}
}
