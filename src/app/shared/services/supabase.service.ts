import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { UserRoles } from '../models/enums';
import { Usuario } from '../models/interfaces';

export interface Profile {
  id?: string;
  username: string;
  usersurname?: string;
  user_uuid?: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }
  async getUserInfo(): Promise<Usuario | null> {
    let { data: { user } } = await this.supabase.auth.getUser();

    if (user) {
      let usuario: Usuario = { id: '', role: '' };

      const { data, error } = await this.supabase
        .from('users')
        .select('role_id, profile_id,isactive, user_id')
        .eq('user_id', user.id);

      if (!error) {
        const profile = data
          ? (await this.getProfile(data[0].user_id)).profile
          : null;
        const role =
          data
            ? (await this.getRole(data[0].role_id)).role
            : null;
        const capa = role ? await this.getCapabilities(role[0].id) : null;

        let capabilities: number[] = [];
        if (capa && capa.capabilities) {
          capabilities = capa.capabilities.map((item) => item.id_module);
        }

        if (profile && role && user && capa) {
          usuario.id = data[0].user_id;
          usuario.avatar_url = profile[0].avatar_url;
          usuario.username = profile[0].username;
          usuario.usersurname = profile[0].usersurname;
          usuario.website = profile[0].website;
          usuario.role = role[0].name;
          usuario.capabilities = capabilities;
        }
      }
      // console.log(usuario)
      return usuario;
    } else {
      // console.log(user)
      return user;
    }
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    };

    return this.supabase.from('profiles').upsert(update);
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }

  //JGJ
  async loginWithPassword(email: string, pass: string) {
    if (!email || !pass)
      throw new Error('El correo y password son obligatorios');
    let { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) {
      console.log(`Error: ${error.message}`);
      throw new Error(`Ha ocurrido un error al momento del logueo.`);
    }

    // const userConfig = data.user ? await this.getUser(data.user.id) : null;
    const userConfig = data.user ? await this.getUserInfo() : null;
    let userLogged: any = {
      session: data.session,
      user: userConfig,
    };
    return { userLogged, error };
  }

  //TODO. REVISAR COMENTARIO EN COMPONENTE signup-company.component.ts
  async signUpCompany(
    email: string,
    pass: string,
    companyName: string,
    companyDescription: string | null,
    companyDirection: string
  ) {
    try {
      if (!email || !pass)
        throw new Error('El correo y password son obligatorios');
      let errors: any = null;
      let profile: any = null;
      let company: any = null;
      let role: any = null;
      let publicUser: any = null;
      let { data, error } = await this.supabase.auth.signUp({
        email,
        password: pass,
        options: {
          emailRedirectTo: `${environment.baseUrl}login`,
        },
      });
      if (error) {
        console.log(`Error: ${error.message}`);
        errors.push(
          new Error(`Ha ocurrido un error al momento de crear el usuario.`)
        );
      }

      if (!error && data.user) {
        //Se crea el profile
        const { data: profileData, error: errorProfile } =
          await this.createProfile(data.user.id);
        if (errorProfile) {
          console.log(`Error: ${errorProfile}`);
          errors.push(
            new Error(
              `Ha ocurrido un error al momento de crear el perfil del usuario.`
            )
          );
        }
        //Se crea el Club
        const { data: companyData, error: errorCompany } =
          await this.createCompany(
            companyName,
            companyDescription,
            companyDirection
          );
        if (errorCompany) {
          console.log(`Error: ${errorCompany}`);
          errors.push(
            new Error(`Ha ocurrido un error al momento de crear la company.`)
          );
        }
        if (companyData) {
          //Se crea el rol ADMIN
          const { data: roleData, error: errorRole } = await this.createRole(
            'Admin',
            companyData[0].id
          );
          if (errorRole) {
            console.log(`Error: ${errorRole}`);
            errors.push(
              new Error(`Ha ocurrido un error al momento de crear el Rol.`)
            );
          }
          role = roleData;
        }
        profile = profileData;
        company = companyData;
      }
      // se agrega info a public.users
      if (data.user && profile && role) {
        console.log(data.user);
        console.log(profile);
        console.log(role);
        const { data: publicUserData, error: errorPublicUser } =
          await this.createPublicUser(
            data.user.id,
            role[0].id,
            profile[0].id,
            true
          );
        if (errorPublicUser) {
          console.log(`Error: ${errorPublicUser}`);
          errors.push(
            new Error(
              `Ha ocurrido un error al momento de crear el Usuario Público.`
            )
          );
        }
        publicUser = publicUserData;
      }

      if (errors && errors.length > 0) {
        throw new Error(JSON.stringify(errors));
      }
      const hola = {
        data: data,
        profile: profile,
        company: company,
        role: role,
        publicUser: publicUser,
      };
      console.log({ hola });
      const chau = [data, profile, company, role, publicUser];
      console.log({ chau });
      return {
        data: {
          data,
          profile,
          company,
          role,
          publicUser,
        },
        errors,
      };
    } catch (error) {
      console.warn(error);
      return { errors: error };
    }
  }
  async signUp(email: string, pass: string) {
    try {
      if (!email || !pass)
        throw new Error('El correo y password son obligatorios');

      //auth.users
      let { data: user, error: errorUser } = await this.supabase.auth.signUp({
        email,
        password: pass,
        options: {
          emailRedirectTo: `${environment.baseUrl}login`,
        },
      });
      if (errorUser)
        throw new Error(`Ha ocurrido un error al momento de crear el usuario.`);
      if (!user.user)
        throw new Error(
          `No se guardo la información del usuario, hablar con el administrador.`
        );

      //public.profiles
      let { data: profile, error: errorProfile } = await this.createProfile(
        user.user.id
      );
      if (errorProfile)
        throw new Error('Ha ocurrido algún error al crear el perfil');
      if (!profile)
        throw new Error(
          'Ha ocurrido algún error al crear el perfil, comunicarse con el administrador.'
        );

      //public.roles
      let { roleAdminId, error: errorRole } = await this.getIdRoleAdmin();
      if (errorRole)
        throw new Error('Ha ocurrido algún error al asignar el rol');

      //public.users
      let { data, error } = await this.createUser(
        user.user.id,
        profile[0].id,
        roleAdminId
      );
      if (error)
        throw new Error(
          'Ha ocurrido algún error al crear el usuario, public.users'
        );

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
  async createProfile(user_uuid: string) {
    try {
      if (!user_uuid) throw new Error('El id del usuario es obligatorio');
      const { data, error } = await this.supabase
        .from('profiles')
        .insert({ user_uuid })
        .select('id');
      if (error) {
        console.log(`Error: ${error.message}`);
        throw new Error(
          `Ha ocurrido un error al momento de crear el perfil del usuario.`
        );
      }
      return { data, error };
    } catch (error) {
      console.warn(error);
      return { data: null, error };
    }
  }
  async getIdRoleAdmin() {
    const { data: roles, error } = await this.supabase
      .from('roles')
      .select('*');

    const roleAdmin = roles?.filter((item) => item.name == 'admin');
    const roleAdminId = roleAdmin ? roleAdmin[0].id : null;

    return { roleAdminId, error };
  }
  async getRoles() {
    const { data: roles, error } = await this.supabase
      .from('roles')
      .select('id,name');

    return { roles, error };
  }
  async getDataRole(rol_id: number) {
    let error = []
    const { data: roles, error: errorRoles } = await this.supabase
      .from('roles_modules')
      .select('id_rol, id_module')
      .eq('id_rol', rol_id)

    const { data: modules, error: errorModules } = await this.supabase
      .from('modules')
      .select('id, name, description')

    //armado roles
    const rolesData = modules?.map(item => {
      let check
      if (roles) {
        check = roles.some((rol) => rol.id_module == item.id);
      }
      return { ...item, check, rol_id }
    })

    //armado errores
    if (errorRoles) error.push(errorRoles);
    if (errorModules) error.push(errorModules);

    return { rolesData, error }
  }
  async updateDataRole(rolesDetail: any, rolesDetailAux: any) {
    const addValues = []
    const deleteValues = []
    for (let i = 0; i < rolesDetail.length; i++) {
      const oldItem = rolesDetail[i];
      const newItem = rolesDetailAux.find((item: any) => item.id === oldItem.id);

      // Verificar si el valor de check es diferente entre los objetos
      if (oldItem.check !== newItem.check) {
        if (newItem.check) {
          addValues.push(newItem)
        } else {
          deleteValues.push(newItem)
        }
      }

    }
    const errorsAll = [];
    let resultBoolean = true;
    if (addValues.length > 0) { const {error} = await this.createCapabilitieRol(addValues); 
      if (error) {
        errorsAll.push(error);
      }
    }

    if (deleteValues.length > 0) { const {errors} = await this.deleteCapabilitieRol(deleteValues); 
      if (errors.length > 0) {
        errors.map((error: any) =>  errorsAll.push(error))
      }
    }
    //Manejo de errores
    if(errorsAll.length > 0){ resultBoolean = false }
    
    return{
      ok: resultBoolean,
      errors : errorsAll
    }
  }
  async createCapabilitieRol(addValues: any) {
    const many = addValues.map((item: any) => {
      return {
        id_rol: item.rol_id,
        id_module: item.id
      }
    })
    const { data, error } = await this.supabase
      .from('roles_modules')
      .insert(many)
      .select()
    return { error }
  }
  async deleteCapabilitieRol(deleteValues: any) {

    let errors: any = []
    for (let id = 0; id < deleteValues.length; id++) {
      const item = deleteValues[id];
      const { error } = await this.supabase
        .from('roles_modules')
        .delete()
        .eq('id_rol', item.rol_id)
        .eq('id_module', item.id)

      if (error) {
        errors.push(error)
      }
    }
    return { errors }

  }
  async createUser(userId: string, profileId: number, roleId: number) {
    const { data, error } = await this.supabase
      .from('users')
      .insert({
        user_id: userId,
        profile_id: profileId,
        role_id: roleId,
        isactive: true,
      })
      .select('*');
    return { data, error };
  }
  async requestResetPass(email: string) {
    if (!email) throw new Error('El email del usuario es obligatorio');
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${environment.baseUrl}reset-password`,
      }
    );
    if (error) {
      console.log(`Error: ${error.message}`);
      throw new Error(
        `Ha ocurrido un error al momento de solicitar el reseteo del password.`
      );
    }
    return { data, error };
  }
  async resetPassword(password: string) {
    try {
      if (!password) throw new Error('El password del usuario es obligatorio');
      const { data, error } = await this.supabase.auth.updateUser({
        password,
      });
      if (error) {
        console.log(`Error: ${error.message}`);
        throw new Error(
          `Ha ocurrido un error al momento de reseteo de password.`
        );
      }
      return { data, error };
    } catch (error) {
      console.warn(error);
      return { error };
    }
  }

  async createCompany(
    companyName: string,
    companyDescription: string | null,
    companyDirection: string
  ) {
    try {
      if (!companyName || !companyDirection)
        throw new Error(
          'El nombre de la company y la dirección son obligatorios'
        );
      const { data, error } = await this.supabase
        .from('company')
        .insert({
          name: companyName,
          descripcion: companyDescription,
          direccion: companyDirection,
        })
        .select('id');
      return { data, error };
    } catch (error) {
      console.warn(error);
      return { error };
    }
  }
  async createPublicUser(
    user_id: string,
    role_id: number,
    profile_id: number,
    isactive: boolean = true
  ) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert({ user_id, role_id, profile_id, isactive })
        .select('id');
      if (error) {
        console.log(`Error: ${error.message}`);
        throw new Error(
          `Ha ocurrido un error al momento de crear el Usuario Publico.`
        );
      }
      return { data, error };
    } catch (error) {
      console.warn(error);
      return { error };
    }
  }

  // async getUser(user_id: String) {
  //   let usuario: {
  //     id: string;
  //     username?: string;
  //     usersurname?: string;
  //     website?: string;
  //     avatar_url?: string;
  //     role: string;
  //     capabilities?: number[];
  //   } = { id: '', role: '' };

  //   const { data: user, error } = await this.supabase
  //     .from('users')
  //     .select('role_id, profile_id,isactive, user_id')
  //     .eq('user_id', user_id);

  //   if (!error) {
  //     const profile = user
  //       ? (await this.getProfile(user[0].user_id)).profile
  //       : null;
  //     const role =
  //       user
  //         ? (await this.getRole(user[0].role_id)).role
  //         : null;
  //     const capa = role ? await this.getCapabilities(role[0].id) : null;

  //     let capabilities: number[] = [];
  //     if (capa && capa.capabilities) {
  //       capabilities = capa.capabilities.map((item) => item.id_module);
  //     }

  //     if (profile && role && user && capa) {
  //       usuario.id = user[0].user_id;
  //       usuario.avatar_url = profile[0].avatar_url;
  //       usuario.username = profile[0].username;
  //       usuario.usersurname = profile[0].usersurname;
  //       usuario.website = profile[0].website;
  //       usuario.role = role[0].name;
  //       usuario.capabilities = capabilities;
  //     }
  //   }

  //   return { usuario, error };
  // }
  async getProfile(user_id: String) {
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .select('username, usersurname,website,avatar_url')
      .eq('user_uuid', user_id)
      .limit(1);

    return { profile, error };
  }
  async getRole(role_id: number) {
    const { data: role, error } = await this.supabase
      .from('roles')
      .select('name,id')
      .eq('id', role_id);

    return { role, error };
  }
  async createRole(role: string, club_id?: number) {
    try {
      if (!role) throw new Error('El rol es obligatorio');
      let dataInsert: any = {name: role}
      if (club_id) {
        dataInsert = {
          ...dataInsert, // Mantener las propiedades existentes
          club: club_id // Agregar la propiedad club si club_id existe
        }
      }
      const { data, error } = await this.supabase
        .from('roles')
        .insert(dataInsert)
        .select('id');
      if (error) {
        console.log(`Error: ${error.message}`);
        throw new Error(`Ha ocurrido un error al momento de crear el Rol.`);
      }
      return { data, error };
    } catch (error) {
      console.warn(error);
      return { error };
    }
  }
  async updateRole(role_id:number, role_name: string){
    const {data, error}= await this.supabase
    .from('roles')
    .update({ name: role_name })
    .eq('id', role_id)
    .select()
    return { data, error}
  }
  async deleteRole(role_id: number) {
    const { data: role, error } = await this.supabase
      .from('roles')
      .delete()
      .eq('id', role_id);

    return { role, error };
  }
  async getCapabilities(role_id: number) {
    const { data: capabilities, error } = await this.supabase
      .from('roles_modules')
      .select('id_module')
      .eq('id_rol', role_id);

    return { capabilities, error };
  }
}
