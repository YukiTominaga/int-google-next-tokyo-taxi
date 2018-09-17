import { Injectable } from '@angular/core';
import { TaxiService } from './taxi.service';
import { AngularFirestore, QueryFn, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Taxi } from '../../models/Taxi';

@Injectable({
  providedIn: 'root'
})
export class FirestoreTaxiService implements TaxiService {
  collection = 'cars';
  public readonly taxies: Observable<Taxi>[];
  private documentIdSubject = new BehaviorSubject<string[]>([]);
  public readonly documentIdList$ = this.documentIdSubject.asObservable();

  constructor(private firestore: AngularFirestore) { }

  public async fetchDisplayTaxis(queryFn: QueryFn): Promise<Observable<Taxi>[]> {
    const documentIdList = await this.fetchDocumentsId(queryFn);
    return await this.fetchTaxiObservableList(documentIdList);
  }

  public getTaxiKeys(): string[] {
    return this.documentIdSubject.getValue();
  }

  private async fetchDocumentsId(queryFn?: QueryFn): Promise<string[]> {
    return this.fetchCollections(queryFn).snapshotChanges().pipe(
      take(1),
      map(actions => {
        return actions.map(action => {
          const id = action.payload.doc.id;
          return id;
        });
      })
    ).toPromise();
  }

  private async fetchTaxiObservableList(documentIdList: string[]): Promise<Observable<Taxi>[]> {
    const taxiDocList: Observable<Taxi>[] = [];
    for (const documentId of documentIdList) {
      const taxiDoc = this.fetchDocument(documentId);
      taxiDocList.push(taxiDoc.valueChanges());
    }
    return await taxiDocList;
  }

  private fetchCollections(queryFn?: QueryFn): AngularFirestoreCollection<Taxi> {
    return this.firestore.collection<Taxi>(this.collection, queryFn);
  }

  private fetchDocument(documentId: string): AngularFirestoreDocument<Taxi> {
    return this.firestore.doc<Taxi>(`${this.collection}/${documentId}`);
  }

}
