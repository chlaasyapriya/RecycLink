import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private baseurl="https://localhost:7243/api/Resource";
  constructor(private http:HttpClient) { }

  getAllResources(){
    return this.http.get(`${this.baseurl}`);
  }

  editResource(resourceId: number, resource:any){
    return this.http.put(`${this.baseurl}/${resourceId}`,resource);
  }

  addResource(resource:any){
    return this.http.post(`${this.baseurl}`,resource);
  }

  deleteResource(resourceId:number){
    return this.http.delete(`${this.baseurl}/${resourceId}`);
  }
}
