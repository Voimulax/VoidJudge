import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatSelect } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { isNumber } from 'util';

import { DialogService } from '../../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../../shared/form-error-state-matcher';
import { TeacherService } from '../teacher.service';
import {
  UserInfo,
  DeleteResultType,
  PutResultType,
  RoleType,
  getRoleType,
  getRoleTypeName
} from '../../../core/auth/user.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-teacher-detail',
  templateUrl: './teacher-detail.component.html',
  styleUrls: ['./teacher-detail.component.css']
})
export class TeacherDetailComponent
  implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  isFormLoading = false;
  isOtherLoading = false;
  matcher = new FormErrorStateMatcher();
  teacherForm: FormGroup;
  @ViewChild('roleTypeSelect') roleTypeSelect: MatSelect;
  get teacherInfo(): UserInfo {
    return this.teacherService.teacherInfo;
  }

  private url = '/admin/teacher';

  constructor(
    private dialogService: DialogService,
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (this.teacherService.teacherInfo) {
      this.createForm();
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.isLoading = true;
    this.isFormLoading = true;
    this.initTeacherInfo();
  }

  ngOnDestroy() {
    this.teacherService.teacherInfo = undefined;
  }

  createForm(): void {
    this.teacherForm = this.fb.group({
      loginName: new FormControl(this.teacherInfo.loginName, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      userName: new FormControl(this.teacherInfo.userName, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      roleType: new FormControl(this.teacherInfo.roleType.toString(), [
        Validators.required
      ])
    });
    this.isLoading = false;
    this.isFormLoading = false;
  }

  save() {
    const teacherInfo = this.teacherForm.value;
    teacherInfo.id = this.teacherInfo.id;
    teacherInfo.roleType = getRoleType(teacherInfo.roleType);
    this.teacherService.put(teacherInfo).subscribe(x => {
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
    this.dialogService.showOkMessage(
      `请问你确定删除用户名为“${this.teacherInfo.loginName}”的${getRoleTypeName(
        this.teacherInfo.roleType
      )}吗`,
      () => {
        const id = this.teacherInfo.id;
        this.teacherService.delete(id).subscribe(x => {
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
      }
    );
  }

  resetPassword() {
    const teacherInfo = this.teacherInfo;
    teacherInfo.password = '';
    this.teacherService.put(teacherInfo).subscribe(x => {
      if (x.type === PutResultType.ok) {
        this.dialogService.showNoticeMessage(
          `重置成功，新密码是“${x.user.password}”, 请保存好！`,
          () => {
            this.createForm();
          }
        );
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
    return !this.teacherInfo && this.isLoading;
  }

  setIsFormLoading(b: boolean) {
    this.isFormLoading = b;
    this.roleTypeSelect.disabled = b;
  }

  private initTeacherInfo() {
    if (!this.teacherService.teacherInfo) {
      const id = this.route.snapshot.paramMap.get('id');
      const nid = Number(id);
      if (isNumber(nid) && !isNaN(nid)) {
        this.getTeacher(nid);
      } else {
        this.goBack();
      }
    } else {
      this.isLoading = false;
      this.isFormLoading = false;
    }
  }

  private getTeacher(nid: number) {
    this.teacherService.get(nid).subscribe(
      x => {
        if (x) {
          this.teacherService.teacherInfo.id = nid;
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
