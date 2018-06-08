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
import { StudentInfo, StudentResultType } from '../../student.model';
import { StudentService } from '../../student.service';
import { UserType } from '../../../../core/auth/user.model';

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
    if (!this.studentService.studentInfo) {
      this.studentService.studentInfo = {
        loginName: '',
        userName: '',
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
      loginName: new FormControl(this.studentService.studentInfo.loginName, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      userName: new FormControl(this.studentService.studentInfo.userName, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      group: new FormControl(this.studentService.studentInfo.group, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      password: new FormControl(this.studentService.studentInfo.password, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ])
    });
  }

  create() {
    const si: StudentInfo = this.studentForm.value;
    si.userType = UserType.student;
    this.studentService.addStudent(si).subscribe(x => {
      if (x.type === StudentResultType.ok) {
        this.dialogService.showNoticeMessage('创建成功');
      } else if (x.type === StudentResultType.wrong) {
        this.dialogService.showErrorMessage('创建失败, 上传内容有错');
      } else if (x.type === StudentResultType.repeat) {
        const s = new Set(x.repeat.map(xx => xx.loginName));
        this.dialogService.showErrorMessage(`学号为“${si.loginName}”的学生已经被创建`);
      } else {
        this.dialogService.showErrorMessage('网络错误');
      }
    });
  }
}
