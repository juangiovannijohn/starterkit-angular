import { Component , OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { UserRoles } from 'src/app/shared/models/enums';
import { SupabaseService } from 'src/app/shared/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loading = false;
  showIntranet: boolean = false; //para cuando ya se está logueado

  loginFormWP = this.formBuilder.group({
    email: ['rodriguezjuanm@live.com', [Validators.required, Validators.email]],
    pass: ['Miyagi1', [Validators.required, Validators.minLength(6)]]
  });
  showAlertModal:boolean=false;
  classesModal:string = '';
  messageModal:string = '';
  user: any;
  constructor(
    private router: Router, private route: ActivatedRoute,
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {}

  async ngOnInit(): Promise<void> {
    const usuario = await this.supabase.getUserInfo();
    if(usuario){
      this.showIntranet = true
    } 
  }


  async login(): Promise<void> {
    try {
      this.loading = true
      const email = this.loginFormWP.value.email as string
      const pass = this.loginFormWP.value.pass as string
      const { userLogged, error } = await this.supabase.loginWithPassword(email, pass)
      if (error) throw error
      //TODO

        this.user = userLogged
        console.log(userLogged)
        this.router.navigateByUrl('intranet')
      //FIN TODO
    } catch (error) {
      if (error instanceof Error) {
        this.openAlert('text-red-600', `${error.message}`);
        this.supabase.signOut();
      }
    } finally {
      this.loginFormWP.reset()
      this.loading = false
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
