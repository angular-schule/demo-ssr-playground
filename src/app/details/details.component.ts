import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pizza } from '../shared/pizza';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PizzaService } from '../shared/pizza.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  pizza$: Observable<Pizza>;

  constructor(private route: ActivatedRoute, private ps: PizzaService) { }

  ngOnInit() {
    this.pizza$ = this.route.paramMap.pipe(
      map(params => parseInt(params.get('id'), 10)),
      switchMap(id => this.ps.getById(id))
    );
  }

}
