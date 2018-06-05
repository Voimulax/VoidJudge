import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../shared/form-error-state-matcher';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  matcher = new FormErrorStateMatcher();
  loginForm: FormGroup;
  @ViewChild('userNameBox') userNameBox;

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
    this.loginForm = this.fb.group({
      userName: new FormControl('', [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ])
    });
  }

  login() {
    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe(b => {
      if (b) {
        this.router.navigate([this.authService.redirectUrl]);
      } else {
        this.dialogService.showErrorMessage('用户名或密码错误', () => {
          this.isLoading = false;
          this.loginForm.reset();
          this.userNameBox.nativeElement.focus();
        });
      }
    });
  }
}
