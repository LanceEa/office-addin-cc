import { Component, OnDestroy } from '@angular/core';
import { Subject, fromEvent, Observable } from 'rxjs';
import { map, filter, takeUntil, exhaustMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-web-worker',
  templateUrl: './web-worker.component.html',
  styleUrls: ['./web-worker.component.scss']
})
export class WebWorkerComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  simpleWorker: Worker = null;
  simpleMessage$ = new Subject<string>();

  fibWorker: Worker = null;
  fibWorkerEvents$: Observable<any>;
  fibWorkerCalculating = false;
  fibWorkerMessage$ = new Subject<string>();

  startSimpleWorker() {
    this.simpleWorker = new Worker('app/web-worker/simple-worker.js');
    this.simpleWorker.addEventListener('message', this.simpleHandler.bind(this));
  }
  stopSimpleWorker() {
    this.simpleWorker.terminate();
    this.simpleWorker.removeEventListener('message', this.simpleHandler);
    this.simpleWorker = null;
    this.simpleMessage$.next('');
  }

  sendSimpleMessage(message: string) {
    this.simpleWorker.postMessage(message);
  }

  private simpleHandler(event) {
    this.simpleMessage$.next(event.data);
  }

  // FIBONACCI WORKER
  startFibWorker() {
    this.fibWorker = new Worker('./fib.worker', { type: 'module' });

    this.fibWorkerEvents$ = fromEvent(this.fibWorker, 'message').pipe(
      map((event: MessageEvent) => JSON.parse(event.data))
    );
  }

  async mainCalculateFibonacci() {
    this.fibWorkerCalculating = true;
    this.fibWorkerMessage$.next('');
    if (window['Excel']) {
      // grab value from excel sheet
      const value = await this.getA1Value();
      
      // calculate fib
      const result = this._fib(value);

      // write result to excel
      this.writeValueA2(result);
      this.fibWorkerCalculating = false;
      return;
    }

    const fibResult = this._fib(40);
    this.fibWorkerMessage$.next(`Fibonacci Calculated as: ${fibResult}`);
    this.fibWorkerCalculating = false;
  }

  async workerCalculateFibonacci() {
    this.fibWorkerMessage$.next('');
    if (window['Excel']) {
      // grab value from excel sheet
      const value = await this.getA1Value();

      this._fibWorker(value)
        .pipe(
          take(1),
          tap(result => this.writeValueA2(result))
        )
        .subscribe();
      return;
    }

    this._fibWorker(40)
      .pipe(take(1))
      .subscribe(fibResult => this.fibWorkerMessage$.next(`Fibonacci Calculated as: ${fibResult}`));
  }

  private _fibWorker(n: number): Observable<number> {
    const message = JSON.stringify({
      type: 'FIB_REQUEST',
      value: n
    });

    this.fibWorkerCalculating = true;
    this.fibWorker.postMessage(message);

    return this.fibWorkerEvents$.pipe(
      filter(event => event.type === 'FIB_RESULT'),
      take(1),
      map(({ value }) => {
        this.fibWorkerCalculating = false;
        return value;
      })
    );
  }

  private _fib(n: number): number {
    if (n <= 1) {
      return 1;
    }

    return this._fib(n - 1) + this._fib(n - 2);
  }

  private getA1Value() {
    return Excel.run(async ctx => {
      const sheet = ctx.workbook.worksheets.getItemOrNullObject('sheet1');
      await ctx.sync();
      if (sheet.isNullObject) {
        throw Error('Please create "sheet1" for this demo');
      }

      const a1 = sheet.getRange('A1').load(['values']);
      return ctx.sync().then(() => a1.values[0][0]);
    });
  }

  private writeValueA2(value: number) {
    return Excel.run(async ctx => {
      const sheet = ctx.workbook.worksheets.getItemOrNullObject('sheet1');
      await ctx.sync();
      if (sheet.isNullObject) {
        throw Error('Please create "sheet1" for this demo');
      }

      sheet.getRange('A2').values = [[value]];
      return ctx.sync();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.fibWorker) {
      this.fibWorker.terminate();
    }

    if (this.simpleWorker) {
      this.simpleWorker.terminate();
    }
  }
}
