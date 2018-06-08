import { Injectable } from '@angular/core';
import { Item } from './item';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private items: Item[] = [
    { id: 'book', title: 'Book', description: 'Pages full of knowledge' },
    { id: 'fridge', title: 'Fridge', description: 'Delicious food behind a door' },
    { id: 'bed', title: 'Bed', description: 'Rest and reload from coding' },
    { id: 'garden', title: 'Garden', description: 'Flowers, grass and barbecue' }
  ];

  constructor() { }

  getAll(): Observable<Item[]> {
    return of(this.items);
  }

  getById(id: string): Observable<Item> {
    const item = this.items.find(it => it.id === id);
    return of(item);
  }
}
