import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-create',
  templateUrl: './teacher-create.component.html',
  styleUrls: ['./teacher-create.component.css']
})
export class TeacherCreateComponent implements OnInit {
  private url = '/admin/teacher';

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate([this.url]);
  }
}
