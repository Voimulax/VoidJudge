import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog, MatSelect } from '@angular/material';
import { Router } from '@angular/router';

import { DialogService } from '../../../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../../../shared/form-error-state-matcher';
import { TeacherInfo } from '../../teacher.model';
import { TeacherService } from '../../teacher.service';

@Component({
  selector: 'app-teacher-create-single',
  templateUrl: './teacher-create-single.component.html',
  styleUrls: ['./teacher-create-single.component.css']
})
export class TeacherCreateSingleComponent implements OnInit {
  isLoading = false;
  matcher = new FormErrorStateMatcher();
  teacherForm: FormGroup;
  @ViewChild('userTypeSelect') userTypeSelect: MatSelect;

  constructor(
    private dialogService: DialogService,
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private router: Router
  ) {
    if (!this.teacherService.currentTeacherInfo) {
      this.teacherService.currentTeacherInfo = {
        userName: '',
        name: '',
        password: '',
        userType: 1
      };
    }
    this.createForm();
   }

  ngOnInit() {
  }

  createForm() {
    this.teacherForm = this.fb.group({
      userName: new FormControl(this.teacherService.currentTeacherInfo.userName, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      name: new FormControl(this.teacherService.currentTeacherInfo.name, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      password: new FormControl(this.teacherService.currentTeacherInfo.password, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      userType: new FormControl(this.teacherService.currentTeacherInfo.userType.toString(), [
        Validators.required
      ])
    });
  }

  setIsLoading(b: boolean) {
    this.isLoading = b;
    this.userTypeSelect.disabled = b;
  }

  create() {}
}
