import { Component, OnInit } from '@angular/core';
import { Pizza } from '../shared/pizza';
import { Input } from '@angular/core';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.scss']
})
export class PizzaComponent implements OnInit {

  @Input() pizza: Pizza;

  constructor() { }

  ngOnInit() {
  }

}
