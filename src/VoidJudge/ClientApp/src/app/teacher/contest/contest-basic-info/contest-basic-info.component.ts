import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';

import { AuthService } from '../../../core/auth/auth.service';
import { ContestService } from '../contest.service';
import { FormErrorStateMatcher } from '../../../shared/form-error-state-matcher';

@Component({
  selector: 'app-contest-basic-info',
  templateUrl: './contest-basic-info.component.html',
  styleUrls: ['./contest-basic-info.component.css']
})
export class ContestBasicInfoComponent implements OnInit {
  contestForm: FormGroup;
  matcher = new FormErrorStateMatcher();

  private url = '/teacher/contest';

  constructor(
    private authService: AuthService,
    private contestService: ContestService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.contestForm = this.fb.group({
      endTime: new FormControl(
        moment(this.contestService.contestInfo.endTime),
        [Validators.required]
      ),
      notice: new FormControl(
        this.contestService.contestInfo.notice
      )
    });
  }

  save() {}
}
