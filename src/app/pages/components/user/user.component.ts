import { Component } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  user: any = null;
  constructor( private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId'); 
    if (userId) {
      this.userService.getUserById(+userId).subscribe(
        (data) => {
          this.user = data;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }
  previousPage(){
    var role=this.user.role;
    if(role==="Collector")
      this.router.navigate(['collector']);
    else if(role==="Resident")
      this.router.navigate(['resident']);
    else if(role==="Manager")
      this.router.navigate(['rpmanager']);
    else if(role==="Volunteer")
      this.router.navigate(['volunteer']);
    else if(role==="Admin")
      this.router.navigate(['admin']);
  }
}
