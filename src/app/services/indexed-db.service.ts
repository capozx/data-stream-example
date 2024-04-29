import { Injectable } from '@angular/core';
import { Observable, from, throwError, pipe, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbName = 'appDB';
  private dbVersion = 1;
  private howManyStores: number = 0;
  private baseStoreName = 'data-';

  constructor() { }

  setHowManyStores(howManyStores: number): void {
    this.howManyStores = howManyStores;
  }

  private openDatabase(): Observable<IDBDatabase> {
    return from(new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        reject('Error opening database');
      };

      request.onsuccess = (event) => {
        const db = request.result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = request.result;

        for (let objectStoreIndex = 0; objectStoreIndex < this.howManyStores; objectStoreIndex++) {
          const ithStoreName = this.baseStoreName + objectStoreIndex;
          if (!db.objectStoreNames.contains(ithStoreName)) {
            db.createObjectStore(ithStoreName, { autoIncrement: true });
          }
        }

      };
    }));
  }

  private clearDatabase(): Observable<void> {
    return this.openDatabase().pipe(
      switchMap(db => {
        return from(new Promise<void>((resolve, reject) => {

          for (let objectStoreIndex = 0; objectStoreIndex < this.howManyStores; objectStoreIndex++) {
            const ithStoreName = this.baseStoreName + objectStoreIndex;

            const transaction = db.transaction([ithStoreName], 'readwrite');
            const store = transaction.objectStore(ithStoreName);
            const clearRequest = store.clear();

            clearRequest.onsuccess = () => {
              resolve();
            };

            clearRequest.onerror = (event) => {
              reject('Error clearing database');
            };

          }


        }));
      })
    );
  }

  saveData(objectStoreIndex: number, data: any): Observable<void> {
    return this.openDatabase().pipe(
      switchMap(db => {
        return from(new Promise<void>((resolve, reject) => {

          const ithStoreName = this.baseStoreName + objectStoreIndex;

          const transaction = db.transaction([ithStoreName], 'readwrite');
          const store = transaction.objectStore(ithStoreName);
          const addRequest = store.add(data);

          addRequest.onsuccess = () => {
            resolve();
          };

          addRequest.onerror = (event) => {
            reject(event);
          };
        }));
      })
    );
  }

  getLastDataFromStore(objectStoreIndex: number): Observable<any> {

    return new Observable<any>((observer) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        observer.error('Errore nell\'apertura del database');
      };

      request.onsuccess = (event) => {
        const ithStoreName = this.baseStoreName + objectStoreIndex;

        const db = request.result;
        const transaction = db.transaction(ithStoreName, 'readonly');
        const objectStore = transaction.objectStore(ithStoreName);
        const getRequest = objectStore.getAll();

        getRequest.onsuccess = (event) => {
          const data = getRequest.result;
          const lastData = data[data.length - 1];
          observer.next(lastData);
          observer.complete();
        };

        getRequest.onerror = (event) => {
          observer.error('Errore nel recupero dei dati');
        };
      };
    });

  }

  getAllData(objectStoreIndex: number): Observable<any[]> {
    return new Observable<any[]>(observer => {
      const request = indexedDB.open(this.dbName);
      
      request.onsuccess = (event: any) => {
        const ithStoreName = this.baseStoreName + objectStoreIndex;
        const db = event.target.result;
        const transaction = db.transaction([ithStoreName], 'readonly');
        const objectStore = transaction.objectStore(ithStoreName);
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
          observer.next(getAllRequest.result);
          observer.complete();
        };

        getAllRequest.onerror = (error: any) => {
          observer.error('Error fetching data from IndexedDB: ' + error.target.error.message);
        };
      };

      request.onerror = (error: any) => {
        observer.error('Error opening IndexedDB: ' + error.target.error.message);
      };
    });
  }

  resetDatabase(): Observable<void> {
    return this.clearDatabase();
  }
}
