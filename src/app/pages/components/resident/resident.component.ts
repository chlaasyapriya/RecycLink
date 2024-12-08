import { Component } from '@angular/core';
import { ResidentService } from '../../../shared/services/resident.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-resident',
  templateUrl: './resident.component.html',
  styleUrl: './resident.component.scss'
})
export class ResidentComponent {
  activeSection = 'complaints';
  showComplaintForm = false;
  showParticipationForm = false;
  userId:number=0;
  isNotificationVisible: boolean = false;
  notifications: any[] = [];
  complaints: any[] = [];
  trainings: any[] = [];
  recyclingParticipations: any[] = [];
  incentives: any[] = [];

  complaintData = {
    userId:0,
    issueType: '',
    description: ''
  };

  participationData = {
    userId: 0,
    weight: 0,
    wasteType: ''
  };

  constructor(private residentService: ResidentService, private notificatioService:NotificationService) {}

  ngOnInit(): void {
    this.userId=Number(localStorage.getItem('userId'));
    this.loadComplaints();
    this.loadTrainings();
    this.loadRecyclingParticipations();
    this.loadIncentives();
    this.loadNotifications();
  }

  toggleSection(section: string): void {
    this.activeSection = section;
  }

  loadComplaints(): void {
    this.residentService.getComplaints(this.userId).subscribe(data => this.complaints = data.$values || []);
    this.complaints.sort(
      (a, b) =>
        new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime()
    );
  }

  cancelForm(){
    this.showComplaintForm=false;
    this.showParticipationForm=false;
  }
  submitComplaint(): void {
    this.complaintData.userId=this.userId;
    this.residentService.addComplaint(this.complaintData).subscribe({
      next:(response)=>{
        this.loadComplaints();
        this.resetComplaints();
        this.showComplaintForm = false;
      },
      error:(err)=>{
        this.loadComplaints();
        this.resetComplaints();
        this.showComplaintForm = false;
        console.log("Error adding a complaint");
      }
    })
  }

  resetComplaints(){
    this.complaintData = {
      userId:0,
      issueType: '',
      description: ''
    };
  }

  loadTrainings(): void {
    this.residentService.getTrainings().subscribe(data => this.trainings = data.$values || []);
  }

  loadRecyclingParticipations(): void {
    this.residentService.getParticipations(this.userId).subscribe(data => this.recyclingParticipations = data.$values || []);
    this.recyclingParticipations.sort(
      (a, b) =>
        new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    );
  }

  submitParticipation(): void {
    this.participationData.userId=this.userId;
    this.residentService.addParticipation(this.participationData).subscribe({
      next:(response)=>{
        this.loadRecyclingParticipations();
        this.resetParticipation();
        this.showParticipationForm = false;
      },
      error:(err)=>{
        this.loadRecyclingParticipations();
        this.resetParticipation();
        this.showParticipationForm = false;
        console.log("Error adding a complaint");
      }
    })
  }

  resetParticipation(){
    this.participationData = {
      userId: 0,
      weight: 0,
      wasteType: ''
    };
  }

  loadIncentives(): void {
    this.residentService.getIncentives(this.userId).subscribe(data => this.incentives = data.$values || []);
    this.incentives.sort(
      (a, b) =>
        new Date(b.redemptionDate).getTime() - new Date(a.redemptionDate).getTime()
    );
  }

  toggleNotifications() {
    this.isNotificationVisible = !this.isNotificationVisible;
    if (this.isNotificationVisible) {
      this.loadNotifications();
    }
  }
  
  loadNotifications() {
    this.notificatioService.getNotificationsByUserId(this.userId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.notifications = response.$values;
        this.notifications.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      },
      error: (err: any) => console.error(err)
    });
  }
}
