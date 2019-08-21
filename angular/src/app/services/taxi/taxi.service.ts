import { Injectable } from '@angular/core';
import { Taxi } from '../../models/Taxi';
import { Observable } from 'rxjs';
import { QueryFn } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export abstract class TaxiService {

  constructor() {}

  abstract getTaxiKeys(): string[];

  abstract fetchDisplayTaxis(query: QueryFn | string): Promise<Observable<Taxi>[]>;

}
