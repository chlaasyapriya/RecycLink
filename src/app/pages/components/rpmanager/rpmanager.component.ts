import { Component } from '@angular/core';
import { RecyclingplantService } from '../../../shared/services/recyclingplant.service';
import { HazardousWasteService } from '../../../shared/services/hazardous-waste.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { TrainingService } from '../../../shared/services/training.service';

@Component({
  selector: 'app-rpmanager',
  templateUrl: './rpmanager.component.html',
  styleUrl: './rpmanager.component.scss'
})
export class RpmanagerComponent {
  activeSection: string = 'plantDetails';
  plantDetails: any = null;
  trainings: any[] = [];
  notifications: any[] = [];
  hazardousWastes: any[] = [];
  isPlantFormVisible: boolean = false;
  isNotificationVisible: boolean=false;
  managerId=0;
  plantForm = {
    plantId: 0,
    name: '',
    location: '',
    capacity: 0,
    processedMaterials: '',
    managerId: 0,
  };
  showHazardousWasteForm: boolean = false;
  hazardousWasteForm = {
    wasteId: 0,
    type: '',
    location: '',
    dateCollected: '',
    disposalStatus: '',
    collectorId:0,
    recyclingPlantId:0
  };

  constructor(private recyclingPlantService: RecyclingplantService, private hazardousWasteService: HazardousWasteService, private notificationService:NotificationService, private trainingService:TrainingService ){}

  ngOnInit(): void {
    this.managerId=Number(localStorage.getItem('userId'));
    this.loadPlantDetails();
    this.loadTrainings();
    this.loadNotifications();
  }

  toggleSection(section: string) {
    this.activeSection = section;
    this.loadHazardousWaste();
  }

  toggleNotifications() {
    this.isNotificationVisible = !this.isNotificationVisible;
    if (this.isNotificationVisible) {
      this.loadNotifications();
    }
  }
  
  loadNotifications() {
    this.notificationService.getNotificationsByUserId(this.managerId).subscribe({
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

  loadPlantDetails() {
    this.recyclingPlantService.getPlantByManagerId(this.managerId).subscribe({
      next: (response: any) => {
        this.plantDetails = response;
      },
      error: (err:any) => console.error('Error fetching plant details:', err),
    });
  }

  showPlantForm() {
    this.isPlantFormVisible = true;
    this.plantForm = { ...this.plantDetails }; 
  }

  cancelPlantForm() {
    this.isPlantFormVisible = false;
  }

  onPlantSubmit() {
    this.recyclingPlantService.updatePlant(this.plantForm).subscribe({
      next: () => {
        this.loadPlantDetails(); 
        this.cancelPlantForm();
      },
      error: (err:any) => console.error('Error updating plant:', err),
    });
  }

  loadTrainings() {
    this.trainingService.getTrainingsByAudienceType('Manager').subscribe({
      next: (response: any) => {
        this.trainings = response.$values;
      },
      error: (err:any) => console.error('Error fetching trainings:', err),
    });
  }

  loadHazardousWaste() {
    console.log("in hwaste"+this.plantDetails);
    this.hazardousWasteService.getWasteByPlantId(this.plantDetails.plantId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.hazardousWastes = response.$values;
        this.hazardousWastes.sort(
          (a, b) =>
            new Date(b.dateCollected).getTime() - new Date(a.dateCollected).getTime()
        );

      },
      error: (err: any) => console.error(err)
    });
  }
  
  editHazardousWaste(waste: any) {
    this.hazardousWasteForm = { ...waste };
    this.showHazardousWasteForm = true;
  }

  onHazardousWasteSubmit() {
    this.hazardousWasteService.updateWaste(this.hazardousWasteForm).subscribe({
      next: () => {
        this.loadHazardousWaste();
        this.loadNotifications();
        this.cancelHazardousWasteForm();
        this.showHazardousWasteForm = false;
      },
      error: (err:any) => {
        console.error(err)
        this.loadHazardousWaste();
        this.loadNotifications();
        this.cancelHazardousWasteForm();
        this.showHazardousWasteForm = false;
      }
    });
  }

  cancelHazardousWasteForm() {
    this.showHazardousWasteForm = false;
    this.hazardousWasteForm = {
      wasteId: 0,
      type: '',
      location: '',
      dateCollected: '',
      disposalStatus: '',
      collectorId: 0,
      recyclingPlantId: 0
    };
  }

}
