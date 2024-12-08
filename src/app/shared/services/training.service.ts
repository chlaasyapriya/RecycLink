import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private baseurl="https://localhost:7243/api/Training";

  constructor(private http:HttpClient) { }
  
  getTrainingsByAudienceType(audienceType: string) {
    return this.http.get<any[]>(`${this.baseurl}/audienceType/${audienceType}`);
  }

  getAllTrainings(){
    return this.http.get(`${this.baseurl}`);
  }

  editTraining(trainingId:number, currentTraining: any){
    if (currentTraining.hasOwnProperty(trainingId)) {
      delete currentTraining[trainingId];
    }
    return this.http.put(`${this.baseurl}/${trainingId}`,currentTraining);
  }

  addTraining(training:any){
    return this.http.post(`${this.baseurl}`,training);
  }

  deleteTraining(trainerId:number){
    return this.http.delete(`${this.baseurl}/${trainerId}`);
  }
}
