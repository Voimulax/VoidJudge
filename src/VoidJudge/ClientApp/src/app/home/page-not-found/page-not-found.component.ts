import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatButton } from '@angular/material';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  @ViewChild('backBtn') backBtn: MatButton;
  constructor(private location: Location) {}

  ngOnInit() {
    this.backBtn.focus();
  }

  goBack() {
    this.location.back();
  }
}
