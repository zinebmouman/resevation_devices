import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeftSidebarAdminComponent } from '../left-sidebar-admin/left-sidebar-admin.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LeftSidebarAdminComponent // Import standalone component here
  ],
})
export class AdminModule {}
