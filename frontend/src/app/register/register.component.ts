import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  validationErrors: any = {};
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  registerAction(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.validationErrors = {};

    if (this.password !== this.confirmPassword) {
      this.validationErrors.password = ['Passwords do not match.'];
      return;
    }

    this.isSubmitting = true;

    this.auth.register({ name: this.name, email: this.email, password: this.password, confirmPassword: this.confirmPassword })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Registration successful!';
          // Optionnel: aller direct au dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err?.error?.error || 'An error occurred during registration.';
          console.error('Registration Error:', err);
        }
      });
  }
}
