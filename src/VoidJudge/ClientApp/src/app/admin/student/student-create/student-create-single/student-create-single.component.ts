import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { DialogService } from '../../../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../../../shared/form-error-state-matcher';
import { StudentService } from '../../student.service';
import {
  RoleType,
  UserResultType,
  StudentInfo
} from '../../../../core/auth/user.model';
import { ElementDef } from '@angular/core/src/view';

@Component({
  selector: 'app-student-create-single',
  templateUrl: './student-create-single.component.html',
  styleUrls: ['./student-create-single.component.css']
})
export class StudentCreateSingleComponent implements OnInit {
  @ViewChild('form') form: ElementRef;
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

  ngOnInit() {}

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
    si.roleType = RoleType.student;
    this.studentService.add(si).subscribe(x => {
      if (x.type === UserResultType.ok) {
        this.dialogService.showNoticeMessage('创建成功');
        this.studentService.studentInfo = {
          loginName: '',
          userName: '',
          group: '',
          password: ''
        };
        this.form.nativeElement.reset();
      } else if (x.type === UserResultType.wrong) {
        this.dialogService.showErrorMessage('创建失败, 上传内容有错');
      } else if (x.type === UserResultType.repeat) {
        const s = new Set(x.repeat.map(xx => xx.loginName));
        this.dialogService.showErrorMessage(
          `用户名为“${si.loginName}”的用户已经被创建`
        );
      } else {
        this.dialogService.showErrorMessage('网络错误');
      }
    });
  }
}
