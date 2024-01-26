import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/shared/services/supabase.service';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.css']
})
export class RequestResetPasswordComponent {
  loading = false
  showmessage= false;
  showLoginWP= false;
  showAlertModal:boolean=false;
  classesModal:string = '';
  messageModal:string = '';
  requestForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  })
  constructor(private router: Router, private route: ActivatedRoute,
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder) { }

  async requestNewPass(){
    if (this.requestForm.valid && this.requestForm.value.email) {
      const email = this.requestForm.value.email;
      try {
        this.loading= true
        this.supabase.requestResetPass(email).then(resp=>{
          if (resp.error) {
            this.openAlert('text-red-600', 'Error al enviar correo de recuperación de password, comunicarse con el administrador')
          }else{
            this.openAlert('text-slate-200', 'Correo de recuperación enviado correctamente, revise su casilla.')
            this.router.navigate(['login'], { queryParams: { 'req-reset-pass' : 1}});
          }
        })
        .catch(error => {
          this.openAlert('text-red-600', `${error}`)
        })
        // Restablecer los valores y el estado del formulario
        this.requestForm.patchValue({
        email: ''
        });
      } catch (error) {
        this.openAlert('text-red-600', `${error}`);
        this.requestForm.reset();
      }finally{
        this.loading= false
      }

    }
  }
  openAlert(className:string, message:string){
    this.messageModal = message;
    this.classesModal = className;
    this.showAlertModal = true;
  }
  closeAlert(){
    this.messageModal = '';
    this.classesModal = '';
    this.showAlertModal = false;
  }


}
