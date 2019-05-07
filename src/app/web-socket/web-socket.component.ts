import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-web-socket',
  templateUrl: './web-socket.component.html',
  styleUrls: ['./web-socket.component.scss']
})
export class WebSocketComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private socket = new WebSocket('wss://localhost:8100', ['cc-protocol']);
  calculating = false;
  message$ = new Subject<string>();
  socketEvents$;

  constructor() {}

  ngOnInit() {
    this.socketEvents$ = fromEvent(this.socket, 'message');
  }

  async mainCalculateFibonacci() {
    this.calculating = true;
    this.message$.next('');
    if (window['Excel']) {
      // grab value from excel sheet
      const value = await this.getA1Value();
      console.log(value);
      // call local function

      const result = this._fib(value);

      // write result to excel
      this.writeValueA2(result);
      this.calculating = false;
      return;
    }

    const fibResult = this._fib(40);
    this.message$.next(`Fibonacci Calculated as: ${fibResult}`);
    this.calculating = false;
  }

  async workerCalculateFibonacci() {
    this.calculating = true;
    this.message$.next('');
    if (window['Excel']) {
      // grab value from excel sheet
      const value = await this.getA1Value();

      this.calculateOnSocket(value)
        .pipe(tap((result: any) => this.writeValueA2(result)))
        .subscribe(() => (this.calculating = false));
      return;
    }

    this.calculateOnSocket(40).subscribe(fibResult => {
      this.message$.next(`Fibonacci Calculated as: ${fibResult}`);
      this.calculating = false;
    });
  }

  private calculateOnSocket(value: number) {
    this.socket.send(value.toString());
    return this.socketEvents$.pipe(
      take(1),
      map((message: any) => message.data)
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

    if (this.socket) {
      this.socket.close();
    }
  }
}
