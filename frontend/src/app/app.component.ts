import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeftSidebarAdminComponent } from './admin/left-sidebar-admin/left-sidebar-admin.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { AdminModule } from './admin/admin/admin.module';
import { CommonModule } from '@angular/common';
import { authGuard } from './auth.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LeftSidebarComponent, LeftSidebarAdminComponent, MainComponent, AuthComponent, AdminModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);
  isAdminPage = signal<boolean>(false);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    this.isAdminPage.set(window.location.pathname.includes('/admin'));
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }
}
