import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

import { FormErrorStateMatcher } from '../../../../shared/form-error-state-matcher';
import { TeacherInfo } from '../../teacher.model';

@Component({
  selector: 'app-teacher-info-dialog',
  templateUrl: './teacher-info-dialog.component.html',
  styleUrls: ['./teacher-info-dialog.component.css']
})
export class TeacherInfoDialogComponent implements OnInit {
  matcher = new FormErrorStateMatcher();
  teacherForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TeacherInfo,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {}
  createForm() {
    this.teacherForm = this.fb.group({
      userName: new FormControl(this.data.userName, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      name: new FormControl(this.data.name, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      password: new FormControl(this.data.password, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      userType: new FormControl(this.data.userType.toString(), [
        Validators.required
      ])
    });
  }
}
