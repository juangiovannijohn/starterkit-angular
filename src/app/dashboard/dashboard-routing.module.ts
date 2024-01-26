import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard.component';
import { AbmRolesComponent } from './abm-roles/abm-roles.component';

const routes: Routes = [
  {path: '', component: DashboardComponent , children:
  [
    {path: 'perfil', component: ProfileComponent},
    {path: 'roles', component: AbmRolesComponent}, 
  ]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
