import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInData={
    email:'',
    password:'',
  };
  constructor(private authService: AuthService,private router: Router, private toastr:ToastrService) {}

  onSubmit(signInForm:NgForm): void{
    if (signInForm.invalid) {
      return;
    }
    this.authService.login(this.signInData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.toastr.success("Login successful!!");
        if(this.authService.getRole()==="Collector")
          this.router.navigate(['collector']);
        else if(this.authService.getRole()==="Resident")
          this.router.navigate(['resident']);
        else if(this.authService.getRole()==="Manager")
          this.router.navigate(['rpmanager']);
        else if(this.authService.getRole()==="Volunteer")
          this.router.navigate(['volunteer']);
        else if(this.authService.getRole()==="Admin")
          this.router.navigate(['admin']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
