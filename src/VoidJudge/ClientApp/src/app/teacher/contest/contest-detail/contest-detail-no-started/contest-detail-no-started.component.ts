import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contest-detail-no-started',
  templateUrl: './contest-detail-no-started.component.html',
  styleUrls: ['./contest-detail-no-started.component.css']
})
export class ContestDetailNoStartedComponent implements OnInit {
  private url = '/teacher/contest';

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate([this.url]);
  }
}
