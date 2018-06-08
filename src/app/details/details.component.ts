import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../shared/item';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { ItemService } from '../shared/item.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  item$: Observable<Item>;

  constructor(private route: ActivatedRoute, private is: ItemService) { }

  ngOnInit() {
    this.item$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.is.getById(id))
    );
  }

}
