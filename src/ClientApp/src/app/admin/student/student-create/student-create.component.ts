import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent implements OnInit {
  private url = '/admin/student';

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate([this.url]);
  }
}
