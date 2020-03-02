import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Pizza } from './pizza';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {

  private apiUrl = 'https://pizza.angular.schule';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) { }

  getAll(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(`${this.apiUrl}/pizzas`);
  }

  getById(id: number): Observable<Pizza> {
    return this.http.get<Pizza>(`${this.apiUrl}/pizza/${id}`);
  }
}
