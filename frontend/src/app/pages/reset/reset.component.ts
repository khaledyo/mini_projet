import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent {
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
      this.activatedRoute.params.subscribe(val=>{
        this.token=val['token'];
        console.log(this.token);
      })
    }
   
    errorMsg: string | null = null;
    authService=inject(AuthService);
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
      let resetObj={
        token:this.token,
        password:this.forgetForm.get('password')?.value
      }
      this.authService.resetPassword(resetObj).subscribe({
        next: (res) => {
          alert(res.message);
          this.forgetForm.reset();
          this.router.navigate(['login']);
        },
        error: (err) => {
          alert(err.error.message);
          this.router.navigate(['forget-password']);
        }
      });
      }
}
