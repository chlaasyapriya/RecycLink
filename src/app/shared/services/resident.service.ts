import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {
    private baseUrl="https://localhost:7243/api";

  constructor(private http: HttpClient) {}

  getComplaints(userId:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Complaints/resident/${userId}`);
  }

  getAllComplaints(): Observable<any>{
    return this.http.get(`${this.baseUrl}/Complaints`);
  }

  addComplaint(complaint: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Complaints`, complaint);
  }

  editComplaint(complaintId:number, resolutionStatus:string){
    return this.http.put(`${this.baseUrl}/Complaints/${complaintId}/status/${resolutionStatus}`,"");
  }

  getTrainings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Training/Resident`);
  }

  getParticipations(userId:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Incentive/participation/user/${userId}`);
  }

  addParticipation(participation: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Incentive/participation/add`, participation);
  }

  getIncentives(userId:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Incentive/user/${userId}`);
  }
  getAllIncentives():Observable<any>{
    return this.http.get(`${this.baseUrl}/Incentive/incentives`);
  }

  getAllParticipation():Observable<any>{
    return this.http.get(`${this.baseUrl}/Incentive/participations`);
  }
}
