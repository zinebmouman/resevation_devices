import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  private apiUrl = 'http://localhost:8083/api/devices';
  products: any[] = [];
  currentPage = 1;
  totalPages = 1;
  paginatedProducts: any[] = [];
  isFormVisible = false;
  isEditFormVisible = false;
  isModalOpen: boolean = false;
  editingProduct: any = {}; // Initialize as an empty object

  newProduct = {
    name: '',
    serial_number: '',
    departement_id: null,
    image_url: null as File | null
  };

  constructor(private http: HttpClient) {
    this.fetchProducts();
  }

  ngOnInit() {}

  fetchProducts() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.products = data;
        this.totalPages = Math.ceil(this.products.length / 5);
        this.updatePagination();
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.isEditFormVisible = false;
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.newProduct.image_url = file;
    }
  }

  addProduct() {
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('serialNumber', this.newProduct.serial_number);
    formData.append('departmentId', String(this.newProduct.departement_id));

    if (this.newProduct.image_url) {
      formData.append('image', this.newProduct.image_url, this.newProduct.image_url.name);
    }

    this.http.post(this.apiUrl, formData).subscribe({
      next: (response) => {
        this.fetchProducts();
        this.resetForm();
        window.location.reload();

      },
      error: (err) => console.error('Error adding product:', err)
    });
  }

  resetForm() {
    this.newProduct = { name: '', serial_number: '', departement_id: null, image_url: null };
    this.toggleForm();
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * 5;
    this.paginatedProducts = this.products.slice(startIndex, startIndex + 5);
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

  startUpdateProduct(productId: number) {
    this.http.get<any>(`${this.apiUrl}/${productId}`).subscribe({
      next: (product) => {
        
        console.log('Fetched Product:', product);  // Log the product content
        this.editingProduct = { ...product }; // Clone product data to avoid direct modification
        console.log('Editing Product ID:', this.editingProduct);

        this.isModalOpen = true;  // Open the modal
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });
  }
  
  

  saveUpdatedProduct() {
    console.log('Updating Product:', this.editingProduct);  // Log the product being updated
  
    // Prepare FormData to send the data
    const formData = new FormData();
    formData.append('id', String(this.editingProduct.id));  // Ensure the ID is included
    formData.append('name', this.editingProduct.name);
    formData.append('serialNumber', this.editingProduct.serialNumber);
    formData.append('departmentId', String(this.editingProduct.departmentId));
  
    // Append the image if it's updated
    if (this.editingProduct.imageUrl) {
      formData.append('image', this.editingProduct.imageUrl, this.editingProduct.imageUrl.name);
    }
  
    // Perform the PUT request with FormData
    this.http.put<any>(`${this.apiUrl}/${this.editingProduct.id}`, formData).subscribe({
      next: (response) => {
        console.log('Product updated successfully:', response);
        this.isModalOpen = false;
        this.fetchProducts();  // Reload the product list after update
      },
      error: (err) => {
        console.error('Error updating product:', err);
      }
    });
  }
  
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  updateProduct() {
    const formData = new FormData();
    formData.append('name', this.editingProduct.name);
    formData.append('serialNumber', this.editingProduct.serialNumber);
    formData.append('departmentId', String(this.editingProduct.departmentId));

    if (this.editingProduct.imageUrl) {
      formData.append('image', this.editingProduct.imageUrl, this.editingProduct.imageUrl.name);
    }

    this.http.put(`${this.apiUrl}/devices/${this.editingProduct.id}`, formData).subscribe({
      next: (response) => {
        console.log('Product updated:', response);
        this.fetchProducts();  // Refresh the list after update
        this.isModalOpen = false; // Close the modal
      },
      error: (err) => console.error('Error updating product:', err)
    });
  }

  // Handle image file change
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.editingProduct.imageUrl = file;
    }
  }
  

  deleteProduct(productId: number) {
    this.http.delete(`${this.apiUrl}/${productId}`).subscribe({
      next: (response) => {
        this.fetchProducts();
      },
      error: (err) => console.error('Error deleting product:', err)
    });
  }
}
