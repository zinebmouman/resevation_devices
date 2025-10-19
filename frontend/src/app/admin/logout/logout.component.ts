import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Perform the logout actions
    this.logout();
  }

  logout(): void {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    console.log('Logged out successfully');

    // Redirect to the login page or homepage
    this.router.navigate(['Auth/register']);
  }
}

