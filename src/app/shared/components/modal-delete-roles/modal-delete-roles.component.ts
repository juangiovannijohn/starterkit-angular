import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-modal-delete-roles',
  templateUrl: './modal-delete-roles.component.html',
  styleUrls: ['./modal-delete-roles.component.css']
})
export class ModalDeleteRolesComponent {
  @Input() idRole!: number;
  @Output() cancelled = new EventEmitter<void>();

  constructor(private readonly supabase: SupabaseService){}
  
  confirm() {
    this.supabase.deleteRole(this.idRole)
    .then(resp =>{
      console.log(resp)
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
