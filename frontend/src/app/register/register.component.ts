import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for two-way binding
import { CommonModule } from '@angular/common'; // Import CommonModule to use Angular features
import axios from 'axios'; // Import axios for HTTP requests

@Component({
  selector: 'app-register',
  standalone: true,  // Add this line if you're using Angular standalone components
  imports: [FormsModule, CommonModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Define properties for two-way data binding
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  validationErrors: any = {}; // Initialize an object to hold validation errors
  isSubmitting: boolean = false;
  successMessage: string = ''; // Success message for user feedback
  errorMessage: string = ''; // Error message for user feedback

  registerAction(): void {
    // Clear previous error/success messages
    this.successMessage = '';
    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {
      this.validationErrors.password = ['Passwords do not match.'];
      return;
    }

    // Prepare the data to be sent to the backend
    const userData = {
      email: this.email,
      password: this.password,
      firstName: this.name.split(' ')[0], // Assuming the first part of the name is the first name
      lastName: this.name.split(' ')[1] || '', // Assuming the second part is the last name
    };

    this.isSubmitting = true;

    // Make the API call to register the user
    axios.post('http://localhost:8083/api/auth/register', userData)
      .then((response) => {
        this.isSubmitting = false;
        // Handle success response
        this.successMessage = 'Registration successful!.';
        console.log('Registration Success:', response.data);
        // Optionally, clear form fields after successful registration
        this.name = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
      })
      .catch((error) => {
        this.isSubmitting = false;
        // Handle error response
        if (error.response) {
          // Backend returned an error
          this.errorMessage = error.response.data.error || 'An error occurred during registration.';
        } else {
          // Network error or other issues
          this.errorMessage = 'Unable to connect to the server.';
        }
        console.error('Registration Error:', error);
      });
  }
}
