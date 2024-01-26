import { Component, EventEmitter, Output } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Role } from '../../models/interfaces';

@Component({
  selector: 'app-modal-create-roles',
  templateUrl: './modal-create-roles.component.html',
  styleUrls: ['./modal-create-roles.component.css']
})
export class ModalCreateRolesComponent {

  @Output() cancelled = new EventEmitter<void>();
  role: Role = {id: 0, name: ''}
  constructor(private readonly supabase: SupabaseService){}

  confirm() {

    this.supabase.createRole(this.role.name)
    .then(resp =>{
      console.log(resp)
        if (resp.error) {
          console.error(resp.error);
          alert(resp.error)
        }else{
          this.cancel();
        }
    });
  }

  cancel() {
    this.cancelled.emit();
  }
}
