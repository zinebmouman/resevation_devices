import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private router: Router, private auth: AuthService) {}

  loginAction(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = true;

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Login successful!';
        // Redirection simple (évite le “admin hardcodé”)
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.error || 'Unable to connect or invalid credentials.';
        console.error('Login Error:', err);
      }
    });
  }
}
