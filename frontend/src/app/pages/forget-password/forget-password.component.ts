import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm!: FormGroup;
  fb = inject(FormBuilder);
  isLoading = false;
  ngOnInit(): void {  
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  errorMsg: string | null = null;
  authService=inject(AuthService);
  submit() {
    if (!this.forgetForm.valid) {
      this.errorMsg = 'Veuillez remplir correctement tous les champs.';
      return;
    }
  
    this.errorMsg = null;
    this.isLoading = true;
  
    const { email } = this.forgetForm.value;
  
    this.authService.sendEmail(email).subscribe({
      next: () => {
        alert("E-mail envoyé avec succès !");
        this.isLoading = false; 
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMsg = "E-mail invalide. Veuillez réessayer.";
        } else {
          this.errorMsg = "Une erreur est survenue. Veuillez réessayer.";
        }
        this.isLoading = false; 
      }
    });
  }}