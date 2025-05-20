import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  authService=inject(AuthService);
  activeTab: string = 'account';
  showContent(tab: string) {
    this.activeTab = tab;
  }
  showPassword1 = false;
    showPassword2 = false;
  
    togglePasswordVisibility(field: 'password1' | 'password2') {
      if (field === 'password1') {
        this.showPassword1 = !this.showPassword1;
      } else if (field === 'password2') {
        this.showPassword2 = !this.showPassword2;
      }
    }
    forgetForm!: FormGroup;
      fb = inject(FormBuilder);
      activatedRoute=inject(ActivatedRoute);
      token!:string;
      
      ngOnInit(): void {  
        this.forgetForm = this.fb.group({
          password: ['',Validators.required],
          ConfirmPassword: ['',Validators.required]
        });
      }
      errorMsg: string | null = null;
      router=inject(Router);
      reset(){
        const password = this.forgetForm.get('password')?.value;
        const confirmPassword = this.forgetForm.get('ConfirmPassword')?.value;
  
        if (password !== confirmPassword) {
          
          this.errorMsg = 'Les deux mots de passe doivent être identiques.';
          return;
        }
        if (this.forgetForm.invalid) {
          this.errorMsg = 'Veuillez remplir correctement tous les champs.';
          return;
        }
        
        this.authService.reset(password).subscribe({
          next: (res) => {
            alert(res.message);
            this.forgetForm.reset();
          },
          error: (err) => {
            alert(err.error.message);
           
          }
        });
        }
}