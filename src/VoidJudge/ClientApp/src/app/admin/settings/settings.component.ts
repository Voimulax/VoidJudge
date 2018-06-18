import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../shared/form-error-state-matcher';
import { SettingsService } from './settings.service';
import { GetSettingsResultType, SettingsType, PutSettingsResultType } from './settings.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit {
  isLoading = true;
  matcher = new FormErrorStateMatcher();
  settingsForm: FormGroup;
  @ViewChild('uploadLimit') uploadLimit;

  constructor(
    private dialogService: DialogService,
    private fb: FormBuilder,
    private router: Router,
    private settingsService: SettingsService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.settingsService.gets().subscribe(r => {
      if (r.type === GetSettingsResultType.ok) {
        this.settingsForm.get('uploadLimit').setValue(r['data'].find(d => d.type === SettingsType.uploadLimit).value);
      } else {
        this.dialogService.showErrorMessage('网络错误');
      }
      this.isLoading = false;
    });
  }

  createForm(): void {
    this.settingsForm = this.fb.group({
      uploadLimit: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.pattern(/^\d+$/)])
    });
  }

  save() {
    const settingsInfos = [{ type: SettingsType.uploadLimit, value: this.settingsForm.get('uploadLimit').value }];
    this.settingsService.puts(settingsInfos).subscribe(r => {
      if (r === PutSettingsResultType.ok) {
        this.dialogService.showNoticeMessage('保存成功');
      } else if (r === PutSettingsResultType.wrong) {
        this.dialogService.showErrorMessage('上传内容有误，保存失败');
      } else {
        this.dialogService.showErrorMessage('网络错误，保存失败');
      }
    });
  }
}
