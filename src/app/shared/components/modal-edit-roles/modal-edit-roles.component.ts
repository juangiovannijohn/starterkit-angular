import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Role } from '../../models/interfaces';

@Component({
  selector: 'app-modal-edit-roles',
  templateUrl: './modal-edit-roles.component.html',
  styleUrls: ['./modal-edit-roles.component.css']
})
export class ModalEditRolesComponent implements OnInit {

  @Input() idRole!: number;
  @Output() cancelled = new EventEmitter<void>();
  role: Role = {id: 0, name: ''}
  constructor(private readonly supabase: SupabaseService){}

  ngOnInit(): void {
    this.getRole(this.idRole);
  }

  getRole(role_id:number){
    this.supabase.getRole(role_id).then(resp=>{
      if (resp.error || !resp.role) {
        console.error('error al leer info del rol');
        return
      }
      this.role = resp?.role[0]
    })
  }

  confirm() {
    this.supabase.updateRole(this.role.id, this.role.name)
    .then(resp =>{
        if (resp.error) {
          console.error(resp.error);
          alert(resp.error.message)
        }else{
          this.cancel();
        }
    });
  }

  cancel() {
    this.cancelled.emit();
  }
}
