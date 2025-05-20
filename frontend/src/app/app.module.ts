import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetComponent } from './pages/reset/reset.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenHttpInterceptor } from './guard/http.token-intercepter';
import { HomeComponent } from './pages/home/home.component';
import { EnseignantComponent } from './pages/enseignant/enseignant.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProfileComponent } from './pages/profile/profile.component';
import { ClasseComponent } from './pages/classe/classe.component';
import { EtudiantComponent } from './pages/etudiant/etudiant.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AddEtudiantComponent } from './pages/add-etudiant/add-etudiant.component';
import { InitiationComponent } from './pages/initiation/initiation.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerfectionementComponent } from './pages/perfectionement/perfectionement.component';
import { PFEComponent } from './pages/pfe/pfe.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgetPasswordComponent,
    ResetComponent,
    HomeComponent,
    EnseignantComponent,
    SidebarComponent,
    HeaderComponent,
    ProfileComponent,
    ClasseComponent,
    EtudiantComponent,
    AddEtudiantComponent,
    InitiationComponent,
    PerfectionementComponent,
    PFEComponent,
    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule ,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    NgbModule ,
    BrowserAnimationsModule,
    MatSelectModule,
    MatOptionModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,



  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenHttpInterceptor,  
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
