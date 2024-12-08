import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecyclingplantService {

  private baseurl="https://localhost:7243/api/RecyclingPlant"
  constructor(private http:HttpClient) { }

  getPlantByManagerId(managerId:number){
    return this.http.get(`${this.baseurl}/manager/${managerId}`);
  }

  getAllPlants(){
    return this.http.get(`${this.baseurl}`);
  }

  updatePlant(plant:any){
    return this.http.put(`${this.baseurl}/${plant.plantId}`,plant);
  }

  addPlant(plant:any){
    return this.http.post(`${this.baseurl}`,plant);
  }  

  deletePlant(plantId:number){
    return this.http.delete(`${this.baseurl}/${plantId}`);
  }
}
