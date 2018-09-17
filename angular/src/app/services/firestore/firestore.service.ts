import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class FirestoreService {
  private firestore: AngularFirestore;

  constructor(private collection: string) { }

  public fetchCollections<T>(queryFn?: QueryFn): Observable<T[]> {
    return this.firestore.collection<T>(this.collection, queryFn).valueChanges();
  }

  public fetchDocument<T>(document: string): Observable<T> {
    return this.firestore.doc<T>(document).valueChanges();
  }

  public fetchAllDocumentsId<T>(queryFn?: QueryFn): string[] {
    let documentIdList: string[];
    this.firestore.collection<T>(this.collection).snapshotChanges().pipe(
      map(actions => {
        documentIdList = actions.map(action => {
          // const data = action.payload.doc.data() as T;
          const id = action.payload.doc.id;
          return id;
        });
      })
    ).subscribe();

    return documentIdList;
  }

}
