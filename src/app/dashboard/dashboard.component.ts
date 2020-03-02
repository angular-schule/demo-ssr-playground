import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { PizzaService } from '../shared/pizza.service';
import { Pizza } from '../shared/pizza';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  pizzas$: Observable<Pizza[]>;
  platform: string;

  constructor(private ps: PizzaService, @Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit() {
    this.pizzas$ = this.ps.getAll();

    if (isPlatformBrowser(this.platformId)) {
      this.platform = '💻 browser';
    } else if (isPlatformServer(this.platformId)) {
      this.platform = '⚙️ server';
    } else {
      this.platform = 'unknown';
    }
  }

}
