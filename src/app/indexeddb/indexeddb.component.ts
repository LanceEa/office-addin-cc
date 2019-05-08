import { Component, OnInit } from '@angular/core';
import { Subject, from, of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { take, map, delay, exhaustMap, concatMap } from 'rxjs/operators';
import * as idb from 'idb-keyval';

interface Country {
  code: string;
  name: string;
}

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
    from(idb.get(this.COUNTRIES_KEY, this.db))
      .pipe(
        exhaustMap((values: Country[]) => {
          if (values) {
            return of(values);
          }

          return this.fetchCountries$().pipe(concatMap(data => this.cacheCountries(data)));
        }),
        take(1)
      )
      .subscribe(countries => {
        this.indexedDBCountriesLoading = false;
        this.indexedDBCountries$.next(countries);
      });
  }

  fetchCountries$(): Observable<Country[]> {
    return this.http.get('assets/countries.json').pipe(
      map(countries => Object.keys(countries).map(key => ({ code: key, name: countries[key] }))),
      map((countries: Country[]) => [...countries].sort((a, b) => a.name.localeCompare(b.name))),
      take(1),
      delay(2000)
    );
  }

  private cacheCountries(countries: Country[]): Observable<Country[]> {
    return from(idb.set(this.COUNTRIES_KEY, countries, this.db)).pipe(map(() => countries));
  }
}
