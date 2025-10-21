import { Component, HostListener, OnInit, signal, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, LeftSidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private router = inject(Router);

  isLeftSidebarCollapsed = signal(false);
  screenWidth = signal<number>(window.innerWidth);
  isAdminPage = signal<boolean>(false);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) this.isLeftSidebarCollapsed.set(true);
  }

  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);

    // détecte si on est sur /admin...
    const evalAdmin = (url: string) => this.isAdminPage.set(url.startsWith('/admin'));
    evalAdmin(this.router.url);
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) evalAdmin(ev.urlAfterRedirects);
    });
  }

  changeIsLeftSidebarCollapsed(v: boolean) {
    this.isLeftSidebarCollapsed.set(v);
  }
}
