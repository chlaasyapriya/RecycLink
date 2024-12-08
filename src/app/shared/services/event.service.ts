import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseurl="https://localhost:7243/api/Events";
  constructor(private http:HttpClient) { }

  getAllEvents(){
    return this.http.get(`${this.baseurl}`);
  }

  registerEvent(volunteerId:number, eventId:number){
    return this.http.post(`${this.baseurl}/${eventId}/register/${volunteerId}`,"");
  }

  getRegisteredEvents(volunteerId:number){
    return this.http.get(`${this.baseurl}/volunteer/${volunteerId}`);
  }
  
  markAsCompleted( eventId:number){
    return this.http.post(`${this.baseurl}/markParticipation/${eventId}`,"");
  }

  addEvent(event:any){
    return this.http.post(`${this.baseurl}`,event);
  }

  updateEvent(event:any,eventId:number){
    return this.http.put(`${this.baseurl}/${eventId}`,event);
  }
}
