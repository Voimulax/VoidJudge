import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { finalize } from 'rxjs/operators';

import { DialogService } from '../../../../shared/dialog/dialog.service';
import { ContestService } from '../../contest.service';
import { ContestProblemInfo, GetContestProblemResultType } from './contest-problem.model';

@Component({
  selector: 'app-contest-problem-list',
  templateUrl: './contest-problem-list.component.html',
  styleUrls: ['./contest-problem-list.component.css']
})
export class ContestProblemListComponent implements OnInit {
  displayedColumns = ['name', 'type', 'content', 'isSubmitted'];
  dataSource = new MatTableDataSource<ContestProblemInfo>();
  isLoading = false;

  get contestInfo() {
    return this.contestService.contestInfo;
  }

  constructor(private dialogService: DialogService, private contestService: ContestService) {
    if (this.contestService.contestInfo.id !== undefined) {
      this.gets();
    }
  }

  ngOnInit() {}

  isNotEmpty() {
    return this.dataSource.data && this.dataSource.data.length > 0;
  }

  getDownloadLink(content: string) {
    return `/Uploads/${content}`;
  }

  download(event: MouseEvent) {
    event.stopPropagation();
  }

  gets() {
    this.isLoading = true;
    this.contestService
      .getProblems()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(r => {
        if (r.type === GetContestProblemResultType.ok) {
          this.dataSource.data = r.data;
        }
      });
  }
}
