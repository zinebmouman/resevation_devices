import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
})
export class DepartmentsComponent {
  private apiUrl = 'http://localhost:8083/api/departments';
  departments: any[] = [];
  currentPage = 1;
  totalPages = 1;
  paginatedDepartments: any[] = [];
  isFormVisible = false;
  isEditFormVisible = false;
  editingDepartment: any = null;

  departmentName: string = '';  // Property to bind the input field

  constructor(private http: HttpClient) {
    this.fetchDepartments();
  }

  fetchDepartments() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.departments = data;
        this.totalPages = Math.ceil(this.departments.length / 5);
        this.updatePagination();
      },
      error: (err) => console.error('Error fetching departments:', err),
    });
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.isEditFormVisible = false; // Reset to add mode
    this.resetForm(); // Reset the form
  }

  addDepartment() {
    if (!this.departmentName) {
      console.error('Department name is required!');
      return;
    }

    this.http.post(this.apiUrl, { name: this.departmentName }).subscribe({
      next: () => {
        this.fetchDepartments();
        this.resetForm();
        this.isFormVisible = false;  // Close the form after adding
      },
      error: (err) => console.error('Error adding department:', err),
    });
  }

  resetForm() {
    this.departmentName = '';  // Reset the departmentName
    this.editingDepartment = null; // Clear the editing department
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * 5;
    this.paginatedDepartments = this.departments.slice(startIndex, startIndex + 5);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  startUpdateDepartment(department: any) {
    this.editingDepartment = { ...department }; // Clone the department to prevent mutating the original
    this.isFormVisible = true;
    this.isEditFormVisible = true; // Show the update form
    this.departmentName = department.name;  // Set the departmentName for editing
  }

  saveUpdatedDepartment() {
    if (!this.departmentName) {
      console.error('Department name is required!');
      return;
    }

    this.editingDepartment.name = this.departmentName;  // Use the departmentName for editing
    this.http.put(`${this.apiUrl}/${this.editingDepartment.id}`, this.editingDepartment).subscribe({
      next: () => {
        this.fetchDepartments();
        this.resetForm();
        this.isFormVisible = false;  // Close the form after updating
      },
      error: (err) => console.error('Error updating department:', err),
    });
  }

  deleteDepartment(departmentId: number) {
    this.http.delete(`${this.apiUrl}/${departmentId}`).subscribe({
      next: () => {
        this.fetchDepartments();
      },
      error: (err) => console.error('Error deleting department:', err),
    });
  }
}
