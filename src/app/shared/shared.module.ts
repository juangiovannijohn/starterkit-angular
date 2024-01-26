import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoFound404Component } from './components/no-found404/no-found404.component';
import { ArsPipePipe } from './models/ars-pipe.pipe';
import { AlertMessageModalComponent } from './components/alert-message-modal/alert-message-modal.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ModalEditRolesComponent } from './components/modal-edit-roles/modal-edit-roles.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalCreateRolesComponent } from './components/modal-create-roles/modal-create-roles.component';
import { ModalDeleteRolesComponent } from './components/modal-delete-roles/modal-delete-roles.component';



@NgModule({
  declarations: [
    NoFound404Component,
    ArsPipePipe,
    AlertMessageModalComponent,
    ConfirmComponent,
    ModalEditRolesComponent,
    ModalCreateRolesComponent,
    ModalDeleteRolesComponent
  ], // aqui se declaran los componentes del modulo
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NoFound404Component,
    ArsPipePipe,
    AlertMessageModalComponent,
    ConfirmComponent,
    ModalEditRolesComponent,
    ModalCreateRolesComponent,
    ModalDeleteRolesComponent
  ], // aqui se exportan los componentes del modulo
})
export class SharedModule { }
