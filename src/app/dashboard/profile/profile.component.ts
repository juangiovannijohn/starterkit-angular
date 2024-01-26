import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthSession } from '@supabase/supabase-js';
import { Usuario } from 'src/app/shared/models/interfaces';
import { Profile, SupabaseService } from 'src/app/shared/services/supabase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading = false

  // @Input()
  // session!: AuthSession

  updateProfileForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    usersurname: ['', [Validators.required]],
    website: [''],
  })
  
  constructor(private readonly supabase: SupabaseService, private formBuilder: FormBuilder) {}

  async ngOnInit(): Promise<void> {
    await this.getProfile()


  }
  async getProfile() {
    try {
      this.loading = true
      //const { user } = this.session
       await this.supabase.getUserInfo().then(
        resp => {
                if (resp) {

                  const {username, usersurname,  website, avatar_url } =  resp
                  console.log({username})
                  console.log({usersurname})
                  console.log({website})
                  console.log({avatar_url})
                  this.updateProfileForm.patchValue({
                    username,
                    usersurname,
                    website,
                  })
                }
        }
      )


    } catch (error) {
      if (error instanceof Error) {
        console.log(error)
        alert(error.message)
      }
    } finally {
      this.loading = false
    }
  }

  async updateProfile(): Promise<void> {
    // try {
    //   this.loading = true
    //   const { user } = this.session

    //   const username = this.updateProfileForm.value.username as string
    //   const website = this.updateProfileForm.value.website as string
    //   const avatar_url = this.updateProfileForm.value.avatar_url as string

    //   const { error } = await this.supabase.updateProfile({
    //     id: user.id,
    //     username,
    //     website,
    //     avatar_url,
    //   })
    //   if (error) throw error
    // } catch (error) {
    //   if (error instanceof Error) {
    //     alert(error.message)
    //   }
    // } finally {
    //   this.loading = false
    // }
  }

}
