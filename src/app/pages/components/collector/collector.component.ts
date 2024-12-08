import { Component } from '@angular/core';
import { CollectorService } from '../../../shared/services/collector.service';
import { TrainingService } from '../../../shared/services/training.service';
import { HazardousWasteService } from '../../../shared/services/hazardous-waste.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-collector',
  templateUrl: './collector.component.html',
  styleUrl: './collector.component.scss'
})
export class CollectorComponent {
  activeSection: string = 'collections';
  collections: any[] = [];
  trainings: any[] = [];
  hazardousWastes: any[] = [];
  collectorId: number = 0;
  isNotificationVisible: boolean = false;
  notifications: any[] = [];

  isFormVisible: boolean = false;
  isEditMode: boolean = false;
  collectionForm = {
    collectionId: 0,
    collectorId : this.collectorId,
    location: '',
    wasteType: '',
    pickupDate: '',
    quantity: '',
    status: ''
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

  constructor( private collectorService: CollectorService, private trainingService: TrainingService, private hazardousWasteService:HazardousWasteService, private notificatioService:NotificationService) {}

  ngOnInit(): void {
    this.collectorId = Number(localStorage.getItem('userId'));
    this.loadCollections();
    this.loadTrainings();
    this.loadHazardousWaste();
    this.loadNotifications();
  }

  toggleSection(section: string) {
    this.activeSection = section;
  }

  showForm(mode: string, collection: any = null) {
    this.isFormVisible = true;
    this.isEditMode = mode === 'edit';

    if (this.isEditMode && collection) {
      this.collectionForm = { ...collection };
    } else {
      this.resetForm();
    }
  }

  cancelForm() {
    this.isFormVisible = false;
    this.resetForm();
  }

  resetForm() {
    this.collectionForm = {
      collectionId: 0,
      collectorId: this.collectorId,
      location: '',
      wasteType: '',
      pickupDate: '',
      quantity: '',      
      status: ''
    };
  }

  onSubmit() {
    if (this.isEditMode) {
      this.collectorService
        .updateCollection(this.collectionForm, this.collectionForm.collectionId)
        .subscribe({
          next: (response) => {
            console.log('Collection updated successfully:', response);
            this.loadCollections(); 
            this.loadNotifications();
          },
          error: (err) => {
            console.error('Error updating collection:', err);
          },
        });
    } else {
      const newCollection = {
        collectorId: this.collectionForm.collectorId, 
        location: this.collectionForm.location,
        wasteType: this.collectionForm.wasteType,
        pickupDate: this.collectionForm.pickupDate,
        quantity: this.collectionForm.quantity,
        status: this.collectionForm.status,
      };
      this.collectorService.addCollection(newCollection).subscribe({
        next: (response) => {
          console.log('Collection added successfully:', response);
          this.loadCollections(); 
          this.loadNotifications();
        },
        error: (err) => {
          console.error('Error adding collection:', err);
          this.loadCollections(); 
          this.loadNotifications();
        },
      });
    }
  
    this.isFormVisible = false;
    this.resetForm();
  }
  

  loadCollections() {
    this.collectorService.getCollectionsByCollectorId(this.collectorId).subscribe({
      next: (response: any) => {
        this.collections = (response as { $id: string; $values: any[] }).$values;
        this.collections.sort(
          (a, b) =>
            new Date(b.pickupDate).getTime() - new Date(a.pickupDate).getTime()
        );
        console.log(this.collections);
      },
      error: (err: any) => console.error(err)
    });
  }

  loadTrainings() {
    this.trainingService.getTrainingsByAudienceType('Collector').subscribe({
      next: (response: any) => {
        this.trainings = response.$values;
      },
      error: (err) => console.error(err)
    });
  }

  loadHazardousWaste() {
    this.hazardousWasteService.getWasteByUserId(this.collectorId).subscribe({
      next: (response: any) => {
        this.hazardousWastes = response.$values;
        this.hazardousWastes.sort(
          (a, b) =>
            new Date(b.dateCollected).getTime() - new Date(a.dateCollected).getTime()
        );

      },
      error: (err: any) => console.error(err)
    });
  }

  deleteCollection(collectionId: number) {
    this.collectorService.deleteCollection(collectionId).subscribe({
      next: () => {this.loadCollections(); this.loadNotifications();},
      error: (err) => {
        console.error(err);
        this.loadCollections();
      }
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

  toggleNotifications() {
    this.isNotificationVisible = !this.isNotificationVisible;
    if (this.isNotificationVisible) {
      this.loadNotifications();
    }
  }
  
  loadNotifications() {
    this.notificatioService.getNotificationsByUserId(this.collectorId).subscribe({
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
