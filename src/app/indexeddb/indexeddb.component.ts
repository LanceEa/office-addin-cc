import { Component, OnInit } from '@angular/core';
import { Subject, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { take, map, delay, exhaustMap } from 'rxjs/operators';
import * as idb from 'idb-keyval';

@Component({
  selector: 'app-indexeddb',
  templateUrl: './indexeddb.component.html',
  styleUrls: ['./indexeddb.component.scss']
})
export class IndexeddbComponent {
  serverCountries$ = new Subject<{ code: string; name: string }[]>();
  serverCountriesLoading = true;
  indexedDBCountries$ = new Subject<{ code: string; name: string }[]>();
  indexedDBCountriesLoading = true;

  private db = new idb.Store('cc-demo', 'list-cache');
  private readonly COUNTRIES_KEY = 'countries';

  constructor(private http: HttpClient) {}

  onServerSelectOpened() {
    // reset set state to re-show loading
    this.serverCountries$.next([]);
    this.serverCountriesLoading = true;

    // fetch from server and update select when done
    this.fetchCountries$().subscribe(countries => {
      this.serverCountriesLoading = false;
      this.serverCountries$.next(countries);
    });
  }

  onIndexedDBSelectOpened() {
    // 1. check indexedDB
    from(idb.get(this.COUNTRIES_KEY))
      .pipe(
        exhaustMap((values: { code: string; name: string }[]) => (values ? of(values) : this.fetchCountries$())),
        take(1)
      )
      .subscribe(countries => {
        this.indexedDBCountriesLoading = false;
        this.indexedDBCountries$.next(countries);
      });
  }

  fetchCountries$() {
    return this.http.get('assets/countries.json').pipe(
      map(countries => Object.keys(countries).map(key => ({ code: key, name: countries[key] }))),
      map((countries: { code: string; name: string }[]) => [...countries].sort((a, b) => a.name.localeCompare(b.name))),
      take(1),
      delay(1000)
    );
  }
}
