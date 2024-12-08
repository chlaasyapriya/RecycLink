import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './pages/components/sign-up/sign-up.component';
import { SignInComponent } from './pages/components/sign-in/sign-in.component';
import { AuthInterceptorService } from './shared/services/auth-interceptor.service';
import { UserComponent } from './pages/components/user/user.component';
import { CollectorComponent } from './pages/components/collector/collector.component';
import { ResidentComponent } from './pages/components/resident/resident.component';
import { RpmanagerComponent } from './pages/components/rpmanager/rpmanager.component';
import { VolunteerComponent } from './pages/components/volunteer/volunteer.component';
import { AdminComponent } from './pages/components/admin/admin.component';
import { HomeComponent } from './pages/components/home/home.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    UserComponent,
    CollectorComponent,
    ResidentComponent,
    RpmanagerComponent,
    VolunteerComponent,
    AdminComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,  
      useClass: AuthInterceptorService,   
      multi: true,                
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
