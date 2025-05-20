import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  
  isLoading = false;
  errorMsg: string | null = null;
  showPassword = false;
  submitted = false; // Track submission state

  ngOnInit(): void {  
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/home'); // Redirection si déjà connecté
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.submitted = true; // Mark form as submitted

    if (this.loginForm.invalid) {
      this.errorMsg = "Veuillez corriger les erreurs avant de continuer.";
      return;
    }

    this.isLoading = true;
    this.errorMsg = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.loginForm.reset(); // Reset form
        this.submitted = false; // Reset submission state
        this.router.navigateByUrl('home');
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 400) {
          this.errorMsg = "L'e-mail ou le mot de passe est incorrect.";
        } else {
          this.errorMsg = "Une erreur est survenue. Veuillez réessayer.";
        }
      }
    });
  }
}
