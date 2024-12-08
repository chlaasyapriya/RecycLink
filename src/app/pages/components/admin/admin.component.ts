import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { ReportService } from '../../../shared/services/report.service';
import html2canvas from 'html2canvas';
import { CollectorService } from '../../../shared/services/collector.service';
import { ResidentService } from '../../../shared/services/resident.service';
import { EventService } from '../../../shared/services/event.service';
import { HazardousWasteService } from '../../../shared/services/hazardous-waste.service';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { RecyclingplantService } from '../../../shared/services/recyclingplant.service';
import { ResourceService } from '../../../shared/services/resource.service';
import { TrainingService } from '../../../shared/services/training.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  activeSection: string = 'reports';
  report: any;
  isLoading:boolean = false;

  users:any[]=[];
  selectedRole:string="";
  filteredUsers : any[]=[];
  collections: any[] = [];
  isFormVisible: boolean = false;
  isEditMode: boolean = false;
  collectionForm = {
    collectionId: 0,
    collectorId : 0,
    location: '',
    wasteType: '',
    pickupDate: '',
    quantity: '',
    status: ''
  };

  showComplaintForm = false;
  complaints: any[] = [];
  complaintStatus="";
  complaintId=0;
  recyclingParticipations: any[] = [];
  incentives: any[] = [];

  events: any[] = []; 
  showEventForm: boolean = false; 
  isEditingEvent: boolean = false;
  currentEvent: any = {}; 
  eventId=0;

  hazardousWastes: any[] = []; 
  showWasteForm: boolean = false; 
  isEditingWaste: boolean = false; 
  currentWaste: any = {};
  wasteId=0;

  recyclingPlants: any[] = []; 
  showPlantForm: boolean = false; 
  currentPlant: any = {}; 

  resources: any[] = []; 
  showResourceForm: boolean = false; 
  isEditingResource: boolean = false; 
  resourceId:number=0;
  currentResource: any = {}; 

  trainings: any[] = []; 
  showTrainingForm: boolean = false; 
  isEditingTraining: boolean = false; 
  currentTraining: any = {};

  isSidebarCollapsed: boolean = false; 
  sections = [
    { key: 'reports', label: 'Reports' },
    { key: 'users', label: 'Users' },
    { key: 'collections', label: 'Collections' },
    { key: 'complaints', label: 'Complaints' },
    { key: 'events', label: 'Events' },
    { key: 'hazardous-waste', label: 'Hazardous Waste' },
    { key: 'recycling-participation', label: 'Recycling Participation' },
    { key: 'incentives', label: 'Incentives' },
    { key: 'recycling-plant', label: 'Recycling Plants' },
    { key: 'resources', label: 'Resources' },
    { key: 'trainings', label: 'Trainings' },
  ];



  constructor(private userService:UserService,private reportService:ReportService, 
    private collectorService:CollectorService, private residentService: ResidentService,
    private eventService:EventService, private hazardousService:HazardousWasteService, private plantService:RecyclingplantService,
    private resourceService:ResourceService, private trainingService: TrainingService ) {}

  ngOnInit():void{
    this.loadUsers();
    this.loadCollections();
    this.loadComplaints();
    this.loadRecyclingParticipations();
    this.loadIncentives();
    this.loadEvents();
    this.loadHazardousWastes();
    this.loadRecyclingPlants();
    this.loadResources();
    this.loadTrainings();
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; 
  }
  navigateTo(section: string) {
    this.activeSection = section;
  }

  fetchReport() {
    this.isLoading = true;
    this.reportService.getReport().subscribe({
      next: (data:any) => {
        this.report = data;
        this.isLoading = false;

      },
      error: (err:any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  downloadImage() {
    const element = document.getElementById('report-content');
    if (element) {
      html2canvas(element).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'weekly-report.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  }

  loadUsers(){
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response.$values;
        this.filteredUsers = [...this.users];
      },
      error: (err) => console.error(err)
    });
  }

  filterUsers(): void {
    if (this.selectedRole != "All") {
      this.filteredUsers = this.users.filter(user => user.role === this.selectedRole);
    } else {
      this.filteredUsers = [...this.users]; 
    }
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
      collectorId: 0,
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
        },
        error: (err) => {
          console.error('Error adding collection:', err);
          this.loadCollections(); 
        },
      });
    }
  
    this.isFormVisible = false;
    this.resetForm();
  }

  loadCollections() {
    this.collectorService.getAllCollections().subscribe({
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

  deleteCollection(collectionId: number) {
    this.collectorService.deleteCollection(collectionId).subscribe({
      next: () => {this.loadCollections();},
      error: (err) => {
        console.error(err);
        this.loadCollections();
      }
    });
  }

  loadComplaints(): void {
    this.residentService.getAllComplaints().subscribe(data => this.complaints = data.$values || []);
    this.complaints.sort(
      (a, b) =>
        new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime()
    );
    console.log(this.complaints);
  }

  cancelComplaintForm(){
    this.showComplaintForm=false;
  }
  submitComplaint(): void {
    console.log(this.complaintId+" "+this.complaintStatus);
    this.residentService.editComplaint(this.complaintId,this.complaintStatus).subscribe({
      next:(response)=>{
        this.loadComplaints();
        this.resetComplaints();
        this.showComplaintForm = false;
      },
      error:(err)=>{
        this.loadComplaints();
        this.resetComplaints();
        this.showComplaintForm = false;
        console.log("Error updating the complaint");
      }
    })
  }

  showComplaintform(id:number){
    this.showComplaintForm=true;
    this.complaintId=id;
  }

  resetComplaints(){
    this.complaintStatus="";
    this.complaintId=0;
  }

  loadRecyclingParticipations(): void {
    this.residentService.getAllParticipation().subscribe(data => this.recyclingParticipations = data.$values || []);
    this.recyclingParticipations.sort(
      (a, b) =>
        new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    );

    console.log("recycling"+this.recyclingParticipations);
  }

  loadIncentives(): void {
    this.residentService.getAllIncentives().subscribe(data => this.incentives = data.$values || []);
    this.incentives.sort(
      (a, b) =>
        new Date(b.redemptionDate).getTime() - new Date(a.redemptionDate).getTime()
    );
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data: any) => {
        this.events = data.$values || [];
        this.events.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        console.log(this.events);
      },
      error: (err: any) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  showAddEventForm(): void {
    this.showEventForm = true;
    this.isEditingEvent = false;
    this.currentEvent = { name: '',  date: '', description: '',location:'', isCompleted: false };
  }

  showEditEventForm(event: any): void {
    this.showEventForm = true;
    this.isEditingEvent = true;
    this.currentEvent = { ...event };
  }

  submitEvent(): void {
    if (this.isEditingEvent) {
      // Update event
      this.eventService.updateEvent(this.currentEvent,this.eventId).subscribe({
        next: () => {
          this.loadEvents();
          this.cancelEventForm();
        },
        error: (err: any) => {
          console.error('Error updating event:', err);
        }
      });
    } else {
      // Add new event
      this.eventService.addEvent(this.currentEvent).subscribe({
        next: () => {
          this.loadEvents();
          this.cancelEventForm();
        },
        error: (err: any) => {
          console.error('Error adding event:', err);
        }
      });
    }
  }

  cancelEventForm(): void {
    this.showEventForm = false;
    this.currentEvent = {};
  }

  markAsCompleted(eventId: number): void {
    this.eventService.markAsCompleted(eventId).subscribe({
      next: () => {
        this.loadEvents();
      },
      error: (err: any) => {
        console.error('Error marking event as completed:', err);
      }
    });
  }

  loadHazardousWastes(): void {
    this.hazardousService.getAllWastes().subscribe({
      next: (data: any) => {
        this.hazardousWastes = data.$values || [];
        this.hazardousWastes.sort(
          (a, b) =>
            new Date(b.dateCollected).getTime() - new Date(a.dateCollected).getTime()
        );
      },
      error: (err: any) => {
        console.error('Error fetching hazardous wastes:', err);
      }
    });
  }

  showAddWasteForm(): void {
    this.showWasteForm = true;
    this.isEditingWaste = false;
    this.currentWaste = { type: '', location: '', dateCollected:dateTimestampProvider, disposalStatus:'', collectorId:0, eecyclingPlantId:0};
  }

  showEditWasteForm(waste: any): void {
    this.showWasteForm = true;
    this.isEditingWaste = true;
    this.currentWaste = { ...waste }; 
  }

  submitWaste(): void {
    if (this.isEditingWaste) {
      // Update hazardous waste
      this.currentWaste.wasteId=this.wasteId;
      this.hazardousService.updateWaste(this.currentWaste).subscribe({
        next: () => {
          this.loadHazardousWastes();
          this.cancelWasteForm();
        },
        error: (err: any) => {
          console.error('Error updating hazardous waste:', err);
          this.loadHazardousWastes();
          this.cancelWasteForm();
        }
      });
    } else {
      // Add new hazardous waste
      this.hazardousService.addHazardousWaste(this.currentWaste).subscribe({
        next: () => {
          this.loadHazardousWastes();
          this.cancelWasteForm();
        },
        error: (err: any) => {
          console.error('Error adding hazardous waste:', err);
          this.loadHazardousWastes();
          this.cancelWasteForm();
        }
      });
    }
  }

  cancelWasteForm(): void {
    this.showWasteForm = false;
    this.currentWaste = {};
  }

  deleteWaste(wasteId: number): void {
    this.hazardousService.deleteHazardousWaste(wasteId).subscribe({
      next: () => {
        this.loadHazardousWastes();
      },
      error: (err: any) => {
        console.error('Error deleting hazardous waste:', err);
      }
    });
  }

  loadRecyclingPlants(): void {
    this.plantService.getAllPlants().subscribe({
      next: (data: any) => {
        this.recyclingPlants = data.$values || [];
      },
      error: (err: any) => {
        console.error('Error fetching recycling plants:', err);
      }
    });
  }

  showAddPlantForm(): void {
    this.showPlantForm = true;
    this.currentPlant = { name: '', location: '', capacity: 0, processedMaterials:'', managerId:0 };
  }

  submitPlant(): void {
    this.plantService.addPlant(this.currentPlant).subscribe({
      next: () => {
        this.loadRecyclingPlants();
        this.cancelPlantForm();
      },
      error: (err: any) => {
        console.error('Error adding recycling plant:', err);
      }
    });
  }

  cancelPlantForm(): void {
    this.showPlantForm = false;
    this.currentPlant = {};
  }

  deletePlant(plantId: number): void {
    this.plantService.deletePlant(plantId).subscribe({
      next: () => {
        this.loadRecyclingPlants();
      },
      error: (err: any) => {
        console.error('Error deleting recycling plant:', err);
      }
    });
  }

  loadResources(): void {
    this.resourceService.getAllResources().subscribe({
      next: (data: any) => {
        this.resources = data.$values || [];
        this.resources.sort(
          (a, b) =>
            new Date(b.maintenanceDate).getTime() - new Date(a.maintenanceDate).getTime()
        );
      },
      error: (err: any) => {
        console.error('Error fetching resources:', err);
      }
    });
  }

  showAddResourceForm(): void {
    this.showResourceForm = true;
    this.isEditingResource = false;
    this.currentResource = {
      type: '',
      quantity: 0,
      location: '',
      maintenanceDate: '',
      status: ''
    };
  }

  showEditResourceForm(resource: any): void {
    this.showResourceForm = true;
    this.isEditingResource = true;
    this.currentResource = { ...resource };
  }

  submitResource(): void {
    if (this.isEditingResource) {
      // Update an existing resource
      this.resourceService.editResource(this.currentResource.resourceId, this.currentResource).subscribe({
        next: () => {
          this.loadResources();
          this.cancelResourceForm();
        },
        error: (err: any) => {
          console.error('Error updating resource:', err);
        }
      });
    } else {
      // Add a new resource
      this.resourceService.addResource(this.currentResource).subscribe({
        next: () => {
          this.loadResources();
          this.cancelResourceForm();
        },
        error: (err: any) => {
          console.error('Error adding resource:', err);
        }
      });
    }
  }

  cancelResourceForm(): void {
    this.showResourceForm = false;
    this.currentResource = {};
  }

  deleteResource(resourceId: number): void {
    this.resourceService.deleteResource(resourceId).subscribe({
      next: () => {
        this.loadResources();
      },
      error: (err: any) => {
        console.error('Error deleting resource:', err);
      }
    });
  }

  loadTrainings(): void {
    this.trainingService.getAllTrainings().subscribe({
      next: (data: any) => {
        this.trainings = data.$values || [];
      },
      error: (err: any) => {
        console.error('Error fetching trainings:', err);
      }
    });
  }

  showAddTrainingForm(): void {
    this.showTrainingForm = true;
    this.isEditingTraining = false;
    this.currentTraining = {
      audienceType: '',
      content: '',
      dateScheduled: '',
      trainerId: 0
    };
  }

  showEditTrainingForm(training: any): void {
    this.showTrainingForm = true;
    this.isEditingTraining = true;
    this.currentTraining = { ...training };
  }

  submitTraining(): void {
    if (this.isEditingTraining) {
      this.trainingService.editTraining(this.currentTraining.trainingId, this.currentTraining).subscribe({
        next: () => {
          this.loadTrainings();
          this.cancelTrainingForm();
        },
        error: (err: any) => {
          console.error('Error updating training:', err);
        }
      });
    } else {
      // Add a new training
      this.trainingService.addTraining(this.currentTraining).subscribe({
        next: () => {
          this.loadTrainings();
          this.cancelTrainingForm();
        },
        error: (err: any) => {
          console.error('Error adding training:', err);
        }
      });
    }
  }

  cancelTrainingForm(): void {
    this.showTrainingForm = false;
    this.currentTraining = {};
  }

  deleteTraining(trainingId: number): void {
    this.trainingService.deleteTraining(trainingId).subscribe({
      next: () => {
        this.loadTrainings();
      },
      error: (err: any) => {
        console.error('Error deleting training:', err);
      }
    });
  }
}

  

 

