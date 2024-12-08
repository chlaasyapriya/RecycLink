import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectorService {
  private baseurl="https://localhost:7243/api/CollectionConroller";

  constructor(private http:HttpClient) { }

  getCollectionsByCollectorId(collectorId: number) {
    return this.http.get<any[]>(`${this.baseurl}/collector/${collectorId}`);
  }

  deleteCollection(collectionId:number){
    return this.http.delete(`${this.baseurl}/${collectionId}`);
  }

  updateCollection(collection:any, collectionId:number){
    return this.http.put(`${this.baseurl}/${collectionId}`,collection);
  }

  addCollection(collection:any){
    return this.http.post(`${this.baseurl}`,collection);
  }

  getAllCollections(){
    return this.http.get<any[]>(`${this.baseurl}`);
  }
}
