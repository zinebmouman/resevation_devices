import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // For [(ngModel)]
import { CommonModule } from '@angular/common'; // Required for standalone components
import axios from 'axios'; // Import axios for HTTP requests

@Component({
  selector: 'app-login',
  standalone: true, // Enables the component to be used standalone
  imports: [FormsModule, CommonModule], // Include necessary modules
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = ''; // Bound to the email input field
  password: string = ''; // Bound to the password input field
  isSubmitting: boolean = false; // Tracks the submission state
  validationErrors: Array<string> = []; // Holds validation errors for display
  successMessage: string = ''; // Holds success message
  errorMessage: string = ''; // Holds error message

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check for existing token or session
  }

  loginAction(): void {
    // Clear previous error/success messages
    this.successMessage = '';
    this.errorMessage = '';

    // Prepare the login data to send to the backend
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.isSubmitting = true;

    // Make the API call to log the user in
    axios.post('http://localhost:8083/api/auth/login', loginData)
      .then((response) => {
        this.isSubmitting = false;
        // Handle success response
        this.successMessage = 'Login successful!';

        const responseData = response.data.token;

        // Extract the ID from the response string
        const idMatch = responseData.match(/ID:\s*(\d+)/); // Regex to extract the ID value
        const userId = idMatch ? idMatch[1] : null;

        // Store token and user ID in localStorage
        localStorage.setItem('token', responseData); // Store the full token string
        if (userId) {
          localStorage.setItem('userid', userId); // Store the extracted ID
        } else {
          console.error('User ID not found in response');
        }

        console.log('Login Success:', response.data);

        // Hardcoded check for admin credentials
        const adminEmail = 'admin@isetsfax.tn';
        const adminPassword = 'isetsfax';

        if (this.email === adminEmail && this.password === adminPassword) {
          // Redirect admin to the admin dashboard
          this.router.navigate(['/admin']);
        } else {
          // Redirect regular users to the user dashboard
          this.router.navigate(['/dashboard']);
        }
      })
      .catch((error) => {
        this.isSubmitting = false;
        // Handle error response
        if (error.response) {
          // Backend returned an error
          this.errorMessage = error.response.data.error || 'An error occurred during login.';
        } else {
          // Network error or other issues
          this.errorMessage = 'Unable to connect to the server.';
        }
        console.error('Login Error:', error);
      });
  }
}
