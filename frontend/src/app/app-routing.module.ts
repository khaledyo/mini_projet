import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetComponent } from './pages/reset/reset.component';

import { authGaurd } from './guard/auth-guard';
import { HomeComponent } from './pages/home/home.component';
import { EnseignantComponent } from './pages/enseignant/enseignant.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ClasseComponent } from './pages/classe/classe.component';
import { EtudiantComponent } from './pages/etudiant/etudiant.component';
import { AddEtudiantComponent } from './pages/add-etudiant/add-etudiant.component';
import { InitiationComponent } from './pages/initiation/initiation.component';
import { PerfectionementComponent } from './pages/perfectionement/perfectionement.component';
import { PFEComponent } from './pages/pfe/pfe.component';







const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset/:token', component: ResetComponent },
  { path: 'add-etudiant/:id', component: AddEtudiantComponent },
  { path: 'home', component: HomeComponent,canActivate:[authGaurd] },
  { path: 'enseignant', component: EnseignantComponent,canActivate:[authGaurd]  },
  { path: 'Initiation', component: InitiationComponent,canActivate:[authGaurd]  },
  { path: 'perfectionnement', component: PerfectionementComponent,canActivate:[authGaurd]  },
  { path: 'pfe', component: PFEComponent,canActivate:[authGaurd]  },
  { path: 'profile', component: ProfileComponent,canActivate:[authGaurd]  },
  { path: 'classe', component: ClasseComponent,canActivate:[authGaurd]  },
  { path: 'etudiants', component: EtudiantComponent,canActivate:[authGaurd]  },
  { path: 'add-etudiant', component: AddEtudiantComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
