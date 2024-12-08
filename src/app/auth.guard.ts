import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const loggedIn = this.authService.isAuthenticated();
    if(loggedIn){
      const requiredRole = route.data['role'] as string[];
      const role=this.authService.getRole();
      if(requiredRole.some(r=>r===role))
        return true;
      this.router.navigate(['/']);
    }
    return false;
  }
};
