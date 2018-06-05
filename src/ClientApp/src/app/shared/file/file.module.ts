import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileService } from './file.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [FileService],
  declarations: []
})
export class FileModule { }
