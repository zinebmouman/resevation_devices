import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LeftSidebarAdminComponent } from '../left-sidebar-admin/left-sidebar-admin.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule, LeftSidebarAdminComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  isLeftSidebarCollapsed = false;
  showAdminSidebar = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.router.url === '/admin') {
      this.router.navigate(['admin/reservations']);
    }
  }

  toggleSidebar(collapsed: boolean): void {
    this.isLeftSidebarCollapsed = collapsed;
  }
}

