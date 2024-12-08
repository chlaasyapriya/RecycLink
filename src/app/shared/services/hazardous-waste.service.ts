import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HazardousWasteService {

  private baseUrl="https://localhost:7243/api/HazardousWaste";

  constructor(private http:HttpClient) { }

  getAllWastes():Observable<any>{
    return this.http.get(`${this.baseUrl}`);
  }

  getWasteByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/collector/${userId}`);
  }

  getWasteByPlantId(plantId:number):Observable<any>{
    return this.http.get(`${this.baseUrl}/plant/${plantId}`);
  }

  updateWaste(waste: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${waste.wasteId}`, waste);
  }

  addHazardousWaste(waste:any): Observable<any>{
    return this.http.post(`${this.baseUrl}`,waste);
  }

  deleteHazardousWaste(wasteId:number){
    return this.http.delete(`${this.baseUrl}/${wasteId}`);
  }
}
