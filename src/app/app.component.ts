import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { UserService } from './shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  title = 'wasteManagementRecyclingSystem';

  isAuthenticated = false;
  userId: number | null = null;
  username: string | null = null;
  role: string | null = null;
  footerDetails=[
    {name:"Legal",items:["Terms & Conditions","Privacy Policy","Cookie Policy"]}
  ];


  constructor(private authService: AuthService, private userService: UserService, private router:Router) {}
  
  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((status)=>{
      this.isAuthenticated=status;
      if (this.isAuthenticated) {
        this.userId = this.authService.getUserId();
        if (this.userId) {
          this.userService.getUserById(this.userId).subscribe(user => {
            this.username = user.username; 
            this.role=user.role;
          });
        }
      }
    })
  }

  navigate(){
    if(this.role==="Collector")
      this.router.navigate(['collector']);
    else if(this.role==="Resident")
      this.router.navigate(['resident']);
    else if(this.role==="Manager")
      this.router.navigate(['rpmanager']);
    else if(this.role==="Volunteer")
      this.router.navigate(['volunteer']);
    else if(this.role==="Admin")
      this.router.navigate(['admin']);
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.username = null;
    this.router.navigate(['']);
  }
}
