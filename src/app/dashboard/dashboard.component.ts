import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../shared/services/supabase.service';
import { Usuario } from '../shared/models/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  user: Usuario | null = { id: '', role:'' }
  role:string | undefined= ''
  showModal:boolean = false
  constructor(
    private router: Router, private route: ActivatedRoute,
    private readonly supabase: SupabaseService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.supabase.getUserInfo().then(resp =>{
      this.user = resp
      this.role = this.user?.role;
      console.log('Usuario en Dashboard',  this.user)
    })
  }
  ngAfterViewInit(): void {
      
  }

  cerrarSesion(){
    this.supabase.signOut().then(resp => {
      if(!resp.error){
       this.router.navigateByUrl('login')
      }
    })
  }
  closeModal() {
    this.showModal = false;
  }
  openModal() {
    this.showModal = true;
  }
}
