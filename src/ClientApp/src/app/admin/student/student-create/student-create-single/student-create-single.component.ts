import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { DialogService } from '../../../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../../../shared/form-error-state-matcher';
import { StudentInfo } from '../../student.model';
import { StudentService } from '../../student.service';

@Component({
  selector: 'app-student-create-single',
  templateUrl: './student-create-single.component.html',
  styleUrls: ['./student-create-single.component.css']
})
export class StudentCreateSingleComponent implements OnInit {
  isLoading = false;
  matcher = new FormErrorStateMatcher();
  studentForm: FormGroup;

  constructor(
    private dialogService: DialogService,
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {
    if (!this.studentService.currentStudentInfo) {
      this.studentService.currentStudentInfo = {
        userName: '',
        name: '',
        group: '',
        password: ''
      };
    }
    this.createForm();
   }

  ngOnInit() {
  }

  createForm() {
    this.studentForm = this.fb.group({
      userName: new FormControl(this.studentService.currentStudentInfo.userName, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      name: new FormControl(this.studentService.currentStudentInfo.name, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      group: new FormControl(this.studentService.currentStudentInfo.group, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      password: new FormControl(this.studentService.currentStudentInfo.password, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ])
    });
  }

  create() {}
}
