import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { customPasswordValidator } from 'src/app/shared/helpers/passwordValidator';
import { SupabaseService } from 'src/app/shared/services/supabase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  loading = false
  showAlertModal: boolean = false;
  classesModal: string = '';
  messageModal: string = '';
  
  signupForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.required, customPasswordValidator()]],
    passConfirm: ['', [Validators.required, customPasswordValidator()]]
  })

  constructor(private router: Router, private route: ActivatedRoute,
    private supabase: SupabaseService,
    private formBuilder: FormBuilder
  ) { }

  async signup(): Promise<void> {
    const pass = this.signupForm.value.pass;
    const passConfirm = this.signupForm.value.passConfirm;

    const passControl = this.signupForm.get('pass');

    if (passControl && passControl.hasError('customPassword') && this.signupForm.invalid) {
      const errorMessage = passControl.getError('customPassword');
      this.openAlert('text-red-600', errorMessage);
      this.signupForm.reset();
    } else if (pass !== passConfirm) {
      this.openAlert('text-red-600', 'Las contraseñas no coinciden.');
      this.signupForm.reset();
    } else {
      this.processSignup();
    }
  }
  private async processSignup(): Promise<void> {
    try {
      this.loading = true;
      const email = this.signupForm.value.email as string;
      const pass = this.signupForm.value.pass as string;
      const { data, error } = await this.supabase.signUp(email, pass);

      if (error) {
        throw error;
      }
      console.log({data})
      this.openAlert('text-slate-600', 'Revise su casilla de correos para confirmar su email');
      //this.router.navigateByUrl('login')
    } catch (error) {
      console.error('Error:', error);
      this.openAlert('text-red-600', 'Error al crear el usuario');
    } finally {
      this.signupForm.reset();
      this.loading = false;
    }
  }

  openAlert(className: string, message: string) {
    this.messageModal = message;
    this.classesModal = className;
    this.showAlertModal = true;
  }
  closeAlert() {
    this.messageModal = '';
    this.classesModal = '';
    this.showAlertModal = false;
    this.supabase.signOut();
    this.router.navigate(['login'], {
      queryParams: { 'new-user': 1 }
    });
  }
}
