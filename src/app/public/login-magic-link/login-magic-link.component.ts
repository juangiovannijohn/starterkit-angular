import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/shared/services/supabase.service';

@Component({
  selector: 'app-login-magic-link',
  templateUrl: './login-magic-link.component.html',
  styleUrls: ['./login-magic-link.component.css']
})
export class LoginMagicLinkComponent {
  loading = false
  signInForm = this.formBuilder.group({
    email: '',
  })
  showAlertModal:boolean=false;
  classesModal:string = '';
  messageModal:string = '';


  constructor(
    private router: Router,
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {}

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const email = this.signInForm.value.email as string
      const { error } = await this.supabase.signIn(email)
      if (error) throw error
      this.openAlert('text-slate-200', `Check your email for the login link!`);
    } catch (error) {
      if (error instanceof Error) {
        this.openAlert('text-red-600', `${error.message}`);
        alert(error.message)
      }
    } finally {
      this.signInForm.reset()
      this.loading = false
    }
  }

  openAlert(className:string, message:string){
    this.messageModal = message;
    this.classesModal = className;
    this.showAlertModal = true;
  }
}
