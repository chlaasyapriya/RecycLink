import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './pages/components/sign-up/sign-up.component';
import { SignInComponent } from './pages/components/sign-in/sign-in.component';
import { UserComponent } from './pages/components/user/user.component';
import { CollectorComponent } from './pages/components/collector/collector.component';
import { ResidentComponent } from './pages/components/resident/resident.component';
import { RpmanagerComponent } from './pages/components/rpmanager/rpmanager.component';
import { VolunteerComponent } from './pages/components/volunteer/volunteer.component';
import { AdminComponent } from './pages/components/admin/admin.component';
import { HomeComponent } from './pages/components/home/home.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path:'sign-up', component:SignUpComponent },
  {path:'sign-in', component:SignInComponent},
  {path:'', component:HomeComponent},
  {path:'admin', component:AdminComponent, canActivate: [AuthGuard], data: { role: ['Admin'] }},
  {path:'user', component: UserComponent , canActivate: [AuthGuard], data: { role: ['Admin','Collector','Resident','Manager','Volunteer'] }},
  {path:'collector', component:CollectorComponent, canActivate: [AuthGuard], data: { role: ['Collector'] }},
  {path:'resident', component:ResidentComponent, canActivate: [AuthGuard], data: { role: ['Resident'] }},
  {path:'rpmanager', component:RpmanagerComponent, canActivate: [AuthGuard], data: { role: ['Manager'] }},
  {path:'volunteer', component:VolunteerComponent, canActivate: [AuthGuard], data: { role: ['Volunteer'] }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
