import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NavItem } from '../../shared/head/nav-item.model';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  navItems: NavItem[] = [
    { label: '考试', link: '/student/contest' },
    { label: '设置', link: '/student/settings' }
  ];

  constructor() {}

  ngOnInit() {}
}
