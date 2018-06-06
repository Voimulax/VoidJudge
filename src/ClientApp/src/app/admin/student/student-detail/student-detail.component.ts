import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { isNumber } from 'util';

import { DialogService } from '../../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../../shared/form-error-state-matcher';
import { StudentInfo } from '../student.model';
import { StudentService } from '../student.service';

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
    return this.studentService.currentStudentInfo;
  }

  private url = '/admin/student';

  constructor(
    private dialogService: DialogService,
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (this.studentService.currentStudentInfo) {
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
    this.studentService.currentStudentInfo = undefined;
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

  save() {}

  delete() {}

  resetPassword() {}

  goBack() {
    this.router.navigate([this.url]);
  }

  getIsLoading() {
    return !this.studentInfo && this.isLoading;
  }

  private initStudentInfo() {
    if (!this.studentService.currentStudentInfo) {
      const id = this.route.snapshot.paramMap.get('id');
      const nid = Number(id);
      if (isNumber(nid) && !isNaN(nid)) {
        this.studentService.getStudent(nid).subscribe(
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
