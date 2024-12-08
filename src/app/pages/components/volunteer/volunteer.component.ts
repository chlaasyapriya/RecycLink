import { Component } from '@angular/core';
import { TrainingService } from '../../../shared/services/training.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { EventService } from '../../../shared/services/event.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrl: './volunteer.component.scss'
})
export class VolunteerComponent {

  activeSection: string = 'events';
  events: any[] = [];
  trainings: any[] = [];
  certificatedEvents:any[]=[];
  certificates: any[] = [];
  notifications: any[] = [];
  registeredEvents: number[] = [];
  volunteerId: number = 0;
  isNotificationVisible:boolean=false;

  constructor(private eventService: EventService, private trainingService: TrainingService, private notificationService: NotificationService ) {}

  ngOnInit(): void {
    this.volunteerId = Number(localStorage.getItem('userId'));
    this.loadEvents();
    this.loadTrainings();
    this.loadNotifications();
  }

  toggleSection(section: string) {
    this.activeSection = section;
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (response: any) => {
        this.events = response.$values;
        this.events.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.loadRegisteredEvents();
        this.loadCertificates();
      },
      error: (err:any) => console.error(err)
    });
  }

  loadRegisteredEvents() {
    this.eventService.getRegisteredEvents(this.volunteerId).subscribe({
      next: (response: any) => {
        this.registeredEvents = response.$values.map((ev: any) => ev.eventId);
      },
      error: (err:any) => console.error(err)
    });
  }

  isRegistered(eventId: number): boolean {
    return this.registeredEvents.includes(eventId);
  }

  registerForEvent(eventId: number) {
    this.eventService.registerEvent(this.volunteerId, eventId).subscribe({
      next: () => this.loadRegisteredEvents(),
      error: (err) => {
        console.error(err);
        this.loadRegisteredEvents();}
    });
  }

  loadTrainings() {
    this.trainingService.getTrainingsByAudienceType('Volunteer').subscribe({
      next: (response: any) => {
        this.trainings = response.$values;
      },
      error: (err) => console.error(err)
    });
  }

  loadCertificates() {
    this.eventService.getRegisteredEvents(this.volunteerId).subscribe({
      next: (response: any) => {
        this.certificates = response.$values;
        this.certificates=this.certificates.filter(c=>c.hasParticipated===true).map((ev: any) => ev.eventId);
        this.certificatedEvents=this.events.filter(e => this.certificates.includes(e.eventId));
      },
      error: (err:any) => console.error(err)
    });
  }

  toggleNotifications() {
    this.isNotificationVisible = !this.isNotificationVisible;
    if (this.isNotificationVisible) {
      this.loadNotifications();
    }
  }

  loadNotifications() {
    this.notificationService.getNotificationsByUserId(this.volunteerId).subscribe({
      next: (response: any) => {
        this.notifications = response.$values;
        this.notifications.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      },
      error: (err) => console.error(err)
    });
  }
}


