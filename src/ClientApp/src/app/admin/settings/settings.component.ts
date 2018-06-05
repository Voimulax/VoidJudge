import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../shared/form-error-state-matcher';
import { SettingsService } from './settings.service';

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

  ngOnInit() { }

  ngAfterViewInit() {
    this.settingsService.getSettings().subscribe(s => {
      this.settingsForm.setValue(s);
      this.isLoading = false;
    });
  }

  createForm(): void {
    this.settingsForm = this.fb.group({
      uploadLimit: new FormControl('', [
        Validators.required,
        Validators.maxLength(6),
        Validators.pattern(/^\d+$/)
      ])
    });
  }

  save() {
    this.isLoading = true;
  }
}
