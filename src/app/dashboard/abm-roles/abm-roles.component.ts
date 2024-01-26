import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/shared/models/interfaces';
import { SupabaseService } from 'src/app/shared/services/supabase.service';

@Component({
  selector: 'app-abm-roles',
  templateUrl: './abm-roles.component.html',
  styleUrls: ['./abm-roles.component.css']
})
export class AbmRolesComponent implements OnInit {
  roles: Role[] = []
  rolesDetail: any = [];
  rolesDetailAux: any[] = [];
  
  //edit role
  showFormEditRoleBoolean: boolean = false
  idRoleToEdit:number = 0
  //create role
  showFormCreateRoleBoolean:boolean = false
  //delete role
  showFormDeleteRoleBoolean: boolean = false

  constructor(
    private router: Router, private route: ActivatedRoute,
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder) {

  }
  ngOnInit(): void {
    this.getRoles()
  }
  getRoles() {
    this.supabase.getRoles().then(resp => {
      if (!resp.error && resp.roles) {
        const roles = resp.roles
        roles.sort((a,b)=> a.name.localeCompare(b.name))
        this.roles = roles
      }
    })
  }
  getDataRole(event: Event) {
    const selectedRoleId = Number((event.target as HTMLSelectElement).value);
    this.supabase.getDataRole(selectedRoleId).then(resp => {
      if (resp.error.length > 0) {
        alert('Ocurrió algún error');
      } else {
        this.rolesDetail = resp.rolesData?.sort((a, b) => a.id - b.id);
        this.rolesDetailAux = JSON.parse(JSON.stringify(this.rolesDetail));  // Crear una copia del rolesDetail
      }
    });
  }
  handleChange(id: number, rolId: string, event: any) {
    const checked = event.target.checked;

    // Encuentra el elemento correspondiente en rolesDetail por su ID o rol_id
    const roleDetail = this.rolesDetailAux.find((detail: any) => detail.id === id && detail.rol_id === rolId);
    if (roleDetail) {
      roleDetail.check = checked;
    }
  }
  saveRolesData() {
    this.supabase.updateDataRole(this.rolesDetail, this.rolesDetailAux).then(resp=> {
      this.handleResultSaveDataRoles(resp);
    })
  }
  handleResultSaveDataRoles(resp : {ok:boolean, errors: any[]} ){
    if (resp.ok) {
      this.rolesDetail = []
      this.rolesDetailAux = []
      this.getRoles();
    }else{
      resp.errors.map(error => console.error(error))
      alert('ha ocurrido algún error')
    }
  }
  showFormEditRole(id_rol:number){
    this.idRoleToEdit = id_rol;
    this.showFormEditRoleBoolean = true
  }
  showFormCreateRole(){
    this.showFormCreateRoleBoolean = true
  }
  showFormDeleteRole(id_rol:number){
    this.idRoleToEdit = id_rol;
    this.showFormDeleteRoleBoolean = true
  }
  closeModalEdit(){
    this.getRoles()
    this.showFormEditRoleBoolean = false
  }
  closeModalCreate(){
    this.getRoles()
    this.showFormCreateRoleBoolean = false
  }
  closeModalDelete(){
    this.getRoles()
    this.showFormDeleteRoleBoolean = false
  }
}
