import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, AuthResult } from '../../core/auth/auth.service';
import { DialogService } from '../dialog/dialog.service';
import { FormErrorStateMatcher } from '../form-error-state-matcher';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  isLoading = false;
  matcher = new FormErrorStateMatcher();
  resetForm: FormGroup;
  @ViewChild('oldPass') oldPass;

  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm(): void {
    this.resetForm = this.fb.group({
      oldPass: new FormControl('', [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      newPass1: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      newPass2: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ])
    });
  }

  checkOldNew(oldP: string, newP: string) {
    if (oldP === newP) {
      throw new Error('旧密码与新密码不能相同');
    }
  }

  checkNew1New2(newP1: string, newP2: string) {
    if (newP1 !== newP2) {
      throw new Error('两次输入的新密码不同');
    }
  }

  reset() {
    this.isLoading = true;
    const oldPass = this.resetForm.get('oldPass').value as string;
    const newPass1 = this.resetForm.get('newPass1').value as string;
    const newPass2 = this.resetForm.get('newPass2').value as string;

    try {
      this.checkOldNew(oldPass, newPass1);
      this.checkNew1New2(newPass1, newPass2);
      this.authService
        .resetPassword({
          loginName: this.authService.user.userName,
          password: oldPass,
          newPassword: newPass2
        })
        .subscribe(x => {
          if (x === AuthResult.ok) {
            this.dialogService.showOkMessage('修改密码成功，即将退出登录...');
            setTimeout(() => {
              this.authService.logout();
              this.router.navigate([`${this.authService.redirectUrl}`]);
            }, 200);
          } else if (x === AuthResult.wrong) {
            this.dialogService.showErrorMessage('旧密码错误', () => {
              this.isLoading = false;
              this.resetForm.reset();
              this.oldPass.nativeElement.focus();
            });
          } else {
            this.dialogService.showErrorMessage('网络错误', () => {
              this.isLoading = false;
              this.resetForm.reset();
              this.oldPass.nativeElement.focus();
            });
          }
        });
    } catch (e) {
      this.dialogService.showErrorMessage((<Error>e).message, () => {
        this.isLoading = false;
        this.resetForm.reset();
        this.oldPass.nativeElement.focus();
      });
    }
  }
}
