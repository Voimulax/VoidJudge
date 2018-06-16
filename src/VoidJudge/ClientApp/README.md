# VoidJudge

前端部分

基于[Angular](https://angular.io/)开发，查看[Demo](https://void-judge.firebaseapp.com/)。

## Install Dependencies

```powershell
npm i -g @angular/cli@latest
npm i
```

其中[@mat-datetimepicker](https://github.com/kuhnroyal/mat-datetimepicker/)基于Angular5开发，安装完之后需要强行修改某些代码才能编译

```javascript
\\ ./node_modules/@mat-datetimepicker/core/@mat-datetimepicker/core.es5.js
\\ ...
import { Subject as Subject$1 } from 'rxjs';
import { Subscription as Subscription$1 } from 'rxjs';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { merge as merge$1 } from 'rxjs';
import { of as of$1 } from 'rxjs';
\\ ...
```

```typescript
\\ ./node_modules/@mat-datetimepicker/core/datetimepicker/datetimepicker.d.ts
\\ ...
import { Subject } from "rxjs";
\\ ...
```

## Run

```powershell
ng serve
```

## Build

```powershell
ng build --prod --build-optimizer
```