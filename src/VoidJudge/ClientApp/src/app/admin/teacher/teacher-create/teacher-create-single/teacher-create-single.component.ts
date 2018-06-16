import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatSelect } from '@angular/material';
import { Router } from '@angular/router';

import { DialogService } from '../../../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../../../shared/form-error-state-matcher';
import { TeacherService } from '../../teacher.service';
import {
  UserInfo,
  getRoleType,
  AddUserResultType
} from '../../../../core/auth/user.model';

@Component({
  selector: 'app-teacher-create-single',
  templateUrl: './teacher-create-single.component.html',
  styleUrls: ['./teacher-create-single.component.css']
})
export class TeacherCreateSingleComponent implements OnInit {
  @ViewChild('form') form: ElementRef;
  isLoading = false;
  matcher = new FormErrorStateMatcher();
  teacherForm: FormGroup;
  @ViewChild('roleTypeSelect') roleTypeSelect: MatSelect;

  constructor(
    private dialogService: DialogService,
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private router: Router
  ) {
    if (!this.teacherService.teacherInfo) {
      this.teacherService.teacherInfo = {
        loginName: '',
        userName: '',
        password: '',
        roleType: 1
      };
    }
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.teacherForm = this.fb.group({
      loginName: new FormControl(this.teacherService.teacherInfo.loginName, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      userName: new FormControl(this.teacherService.teacherInfo.userName, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      password: new FormControl(this.teacherService.teacherInfo.password, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      roleType: new FormControl(
        this.teacherService.teacherInfo.roleType.toString(),
        [Validators.required]
      )
    });
  }

  setIsLoading(b: boolean) {
    this.isLoading = b;
    this.roleTypeSelect.disabled = b;
  }

  create() {
    const si: UserInfo = this.teacherForm.value;
    si.roleType = getRoleType(this.teacherForm.get('roleType').value);
    this.teacherService.add(si).subscribe(x => {
      if (x.type === AddUserResultType.ok) {
        this.dialogService.showNoticeMessage('创建成功', () => {
          this.teacherService.teacherInfo = {
            loginName: '',
            userName: '',
            password: '',
            roleType: 1
          };
          this.form.nativeElement.reset();
        });
      } else if (x.type === AddUserResultType.wrong) {
        this.dialogService.showErrorMessage('上传内容有错，创建失败');
      } else if (x.type === AddUserResultType.repeat) {
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
