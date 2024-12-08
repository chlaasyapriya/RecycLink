import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  signupData = {
    username: '',
    passwordHash: '',
    role: 'Role',
    email: '',
    phoneNumber: '',
    address: '',
  };

  constructor(private authService: AuthService, private router:Router, private toastr:ToastrService) {}

  onSubmit(signUpForm: NgForm): void {
    if (signUpForm.invalid) {
      return;
    }
    this.authService.signup(this.signupData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.toastr.success("Registration successful!");
        this.router.navigate(['sign-in']);
        // alert('Registration Successful!');
      },
      error: (error) => {
        console.error('Registration failed:', error);
        // alert('Failed to register. Please try again.');
      },
    });
  }
}
