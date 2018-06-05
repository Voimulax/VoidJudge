import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog, MatSelect } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { isNumber } from 'util';

import { DialogService } from '../../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../../shared/form-error-state-matcher';
import { TeacherInfo } from '../teacher.model';
import { TeacherService } from '../teacher.service';

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
  @ViewChild('userTypeSelect') userTypeSelect: MatSelect;
  get teacherInfo(): TeacherInfo {
    return this.teacherService.currentTeacherInfo;
  }

  private url = '/admin/teacher';

  constructor(
    private dialogService: DialogService,
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (this.teacherService.currentTeacherInfo) {
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
    this.teacherService.currentTeacherInfo = undefined;
  }

  createForm(): void {
    this.teacherForm = this.fb.group({
      userName: new FormControl(this.teacherInfo.userName, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      name: new FormControl(this.teacherInfo.name, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\S+$/)
      ]),
      userType: new FormControl(this.teacherInfo.userType.toString(), [
        Validators.required
      ])
    });
    this.isLoading = false;
    this.isFormLoading = false;
  }

  save() {}

  delete() {}

  resetPassword() {}

  goBack() {
    this.router.navigate([this.url]);
  }

  getIsLoading() {
    return !this.teacherInfo && this.isLoading;
  }

  setIsFormLoading(b: boolean) {
    this.isFormLoading = b;
    this.userTypeSelect.disabled = b;
  }

  private initStudentInfo() {
    if (!this.teacherService.currentTeacherInfo) {
      const id = this.route.snapshot.paramMap.get('id');
      const nid = Number(id);
      if (isNumber(nid) && !isNaN(nid)) {
        this.teacherService.getTeacher(nid).subscribe(
          x => {
            if (x) {
              this.createForm();
            } else {
              this.goBack();
            }
          },
          error => {
            this.goBack();
          }
        );
      } else {
        this.goBack();
      }
    } else {
      this.isLoading = false;
      this.isFormLoading = false;
    }
  }
}
