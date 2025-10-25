import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user/user.service';
import { UbigeoService } from '../../services/ubigeo/ubigeo.service';
import { UserResponseDTO, UserUpdateDTO } from '../../models/user';
import { Observable, BehaviorSubject, combineLatest, startWith, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

      private userId: string = '248c8b1a-8212-4293-87e2-1a48c484252a'; 
      public user$ = new BehaviorSubject<UserResponseDTO | null>(null);
      public profileForm!: FormGroup;
      public departments$!: Observable<string[]>;
      public provinces$!: Observable<string[]>;
      public districts$!: Observable<string[]>;

      public isEditing: boolean = false;
      public errorMessage: string | null = null;
      public SuccessMessage: string | null = null;
      public isLoading: boolean = true;

      constructor (private fb : FormBuilder, private userService: UserService, private ubigeoService: UbigeoService, private authSerivce: AuthService ){
        this.createForm()
      }

      ngOnInit(): void {
          this.loadUserData();
          this.setupUbigeoListeners()
      }

      createForm():void{
        this.profileForm = this.fb.group({
          name: [{value: '', disabled: !this.isEditing}, [Validators.required, Validators.minLength(2)]],
          email: [{value: '', disabled: true}],
          department: [{value: '', disabled: !this.isEditing}],
          province: [{value: '', disabled: !this.isEditing}],
          district: [{value: '', disabled: !this.isEditing}],
          password: [''],
          confirmPassword: ['']
        })
      }


      loadUserData():void{
        this.isLoading = true;
        this.userService.getUserById(this.userId).subscribe({
          next: (user) =>{
            this.user$.next(user);
            this.profileForm.patchValue({
              name: user.name,
              email: user.email,
              department: user.department,
              province: user.province,
              district: user.district,
            })
            this.isLoading = false;
          }
        });
      }

      setupUbigeoListeners(): void{
        this.departments$ = this.ubigeoService.getDepartments();

      //cargar provincias cuando cambian departamento 
        this.provinces$ = this.profileForm.get('department')!.valueChanges.pipe(
          startWith(this.profileForm.get('department')!.value),
          switchMap(department =>{
            if(!department) return [];
            //Reseta provincia y distrito si departamente cambia
            this.profileForm.get('province')!.setValue('');
            this.profileForm.get('district')!.setValue('');
            return this.ubigeoService.getProvinces(department); 
          })
        );
        
        //cargar distritos cuando cambian departamento y provincia 
        this.districts$ = combineLatest([
          this.profileForm.get('department')!.valueChanges.pipe(startWith(this.profileForm.get('department')!.value)),
          this.profileForm.get('province')!.valueChanges.pipe(startWith(this.profileForm.get('province')!.value))
        ]).pipe(
          switchMap(([department, province])=>{
            if(!department || !province) return[];
            this.profileForm.get('district')!.setValue('')
            return this.ubigeoService.getDistricts(department, province)
          })
        )
      }

      toggleEditMode(enable: boolean): void{
        this.isEditing = enable;
        Object.keys(this.profileForm.controls).forEach(key =>{
          if(key !== 'email' && key !== 'password' && key !=='confirmPassword'){
            this.isEditing ? this.profileForm.get(key)!.enable() : this.profileForm.get(key)!.disable(); 
          }
        })
      }

      onSaveChanges(): void{
        this.errorMessage = null;
        this.SuccessMessage= null;
        if(this.profileForm.invalid){
          this.errorMessage = "Por favor, completa correctamente los campos requeridos";
          return;
        }

        //obtener solo los campos que tienen valor para la actualizacion parcial (PATCH)
        const updatePayload: UserUpdateDTO={
          name: this.profileForm.get('name')!.value,
          department: this.profileForm.get('department')!.value,
          province: this.profileForm.get('province')!.value,
          district: this.profileForm.get('district')!.value,
        };

        this.userService.updateUser(this.userId, updatePayload).subscribe({
          next: (UpdatedUser)=>{
            this.user$.next(UpdatedUser) ;
            this.toggleEditMode(false);
            this.SuccessMessage= 'Perfil actualizado exitosamente';
          },
          error: (err)=>{
            this.errorMessage = 'Error al actualizar:' + err.error.message;
          }
        });
      }

      onDeleteAccount(): void{
        if(confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta accion es irreversible')){
          this.userService.deleteUser(this.userId).subscribe({
            next:()=>{
              //logica para cerrar sesion y redirgir al login o landing page
              console.log('Cuenta Eliminada');
              this.authSerivce.logout();
            },
            error: (err) =>{
              this.errorMessage = 'Error al eliminar la cuenta: '+ err
            }
          })
        }
      }


      

      


}


