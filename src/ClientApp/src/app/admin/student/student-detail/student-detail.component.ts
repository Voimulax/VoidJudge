import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isNumber } from 'util';

import { DialogService } from '../../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../../shared/form-error-state-matcher';
import { StudentService } from '../student.service';
import { RoleType, DeleteResultType, PutResultType, StudentInfo } from '../../../core/auth/user.model';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent
  implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  isFormLoading = false;
  isOtherLoading = false;
  matcher = new FormErrorStateMatcher();
  studentForm: FormGroup;
  get studentInfo(): StudentInfo {
    return this.studentService.studentInfo;
  }

  private url = '/admin/student';

  constructor(
    private dialogService: DialogService,
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (this.studentService.studentInfo) {
      this.createForm();
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.isLoading = true;
    this.isFormLoading = true;
    this.initStudentInfo();
  }

  ngOnDestroy() {
    this.studentService.studentInfo = undefined;
  }

  createForm(): void {
    this.studentForm = this.fb.group({
      loginName: new FormControl(this.studentInfo.loginName, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      userName: new FormControl(this.studentInfo.userName, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      group: new FormControl(this.studentInfo.group, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ])
    });
    this.isLoading = false;
    this.isFormLoading = false;
  }

  save() {
    const studentInfo = this.studentForm.value;
    studentInfo.id = this.studentInfo.id;
    studentInfo.roleType = RoleType.student;
    this.studentService.put(studentInfo).subscribe(x => {
      if (x.type === PutResultType.ok) {
        this.dialogService.showNoticeMessage('修改成功', () => {
          this.createForm();
        });
      } else if (x.type === PutResultType.concurrencyException) {
        this.dialogService.showErrorMessage('暂时无法进行修改');
      } else if (x.type === PutResultType.userNotFound) {
        this.dialogService.showErrorMessage('此用户不存在');
      } else {
        this.dialogService.showErrorMessage('网络错误');
      }
    });
  }

  delete() {
    this.dialogService.showOkMessage(`请问你确定删除用户名为“${this.studentInfo.loginName}”的学生吗`, () => {
      const id = this.studentInfo.id;
      this.studentService.delete(id).subscribe(x => {
        if (x === DeleteResultType.ok) {
          this.dialogService.showNoticeMessage('删除成功', () => {
            this.goBack();
          });
        } else if (x === DeleteResultType.forbiddance) {
          this.dialogService.showErrorMessage('暂时无法进行删除');
        } else if (x === DeleteResultType.userNotFound) {
          this.dialogService.showErrorMessage('此用户不存在');
        } else {
          this.dialogService.showErrorMessage('网络错误');
        }
      });
    });
  }

  resetPassword() {
    const studentInfo = this.studentInfo;
    studentInfo.password = '';
    studentInfo.roleType = RoleType.student;
    this.studentService.put(studentInfo).subscribe(x => {
      if (x.type === PutResultType.ok) {
        this.dialogService.showNoticeMessage(`重置成功，新密码是“${x.user.password}”, 请保存好！`, () => {
          this.createForm();
        });
      } else if (x.type === PutResultType.concurrencyException) {
        this.dialogService.showErrorMessage('暂时无法进行修改');
      } else if (x.type === PutResultType.userNotFound) {
        this.dialogService.showErrorMessage('此用户不存在');
      } else {
        this.dialogService.showErrorMessage('网络错误');
      }
    });
  }

  goBack() {
    this.router.navigate([this.url]);
  }

  getIsLoading() {
    return !this.studentInfo && this.isLoading;
  }

  private initStudentInfo() {
    if (!this.studentService.studentInfo) {
      const id = this.route.snapshot.paramMap.get('id');
      const nid = Number(id);
      if (isNumber(nid) && !isNaN(nid)) {
        this.getStudent(nid);
      } else {
        this.goBack();
      }
    } else {
      this.isLoading = false;
      this.isFormLoading = false;
    }
  }

  private getStudent(nid: number) {
    this.studentService.get(nid).subscribe(
      x => {
        if (x) {
          this.studentService.studentInfo.id = nid;
          this.createForm();
        } else {
          this.goBack();
        }
      },
      error => {
        this.goBack();
      }
    );
  }
}
