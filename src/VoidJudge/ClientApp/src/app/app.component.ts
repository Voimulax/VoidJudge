import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';

import { DialogService } from './shared/dialog/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  isLoadingDialogActive = false;
  isLoading = false;
  private isLoadingSub: Subscription;
  private isloadingDialogSub: Subscription;

  constructor(private dialogService: DialogService, private router: Router) {
    // Listen the navigation events to start or complete the slim bar loading
    this.isLoadingSub = this.router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
          this.isLoading = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.isLoading = false;
        }
      },
      (error: any) => {
        this.isLoading = false;
      }
    );

    this.isloadingDialogSub = this.dialogService.isLoadingDialogActive$.subscribe(
      x => {
        this.isLoadingDialogActive = x;
      },
      (errpr: any) => {
        this.isLoadingDialogActive = false;
      }
    );
  }

  ngOnDestroy(): any {
    this.isLoadingSub.unsubscribe();
    this.isloadingDialogSub.unsubscribe();
  }
}
