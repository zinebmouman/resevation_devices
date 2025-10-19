import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule, HttpClientModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})

export class ReservationsComponent implements OnInit {
  reservations: any[] = [];
  newReservation = {
    userId: null,
    deviceId: null,
    startDate: '',
    endDate: ''
  };
  editingReservation: any = {};
  isFormVisible = false;
  isModalOpen = false;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  paginatedReservations: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getReservations();
  }

  getReservations(): void {
    this.http.get<any[]>('http://localhost:8083/api/reservations').subscribe(
      (data) => {
        this.reservations = data;
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching reservations:', error);
      }
    );
  }

  rservedReservation(id: number): void {
    this.http.get(`http://localhost:8083/api/reservations/reserved/${id}`).subscribe({
      next: (response) => {
        alert(`Reservation with ID ${id} is now reserved.`);
        console.log(response); // Optional: log server response
      },
      error: (err) => {
        alert('Error while updating the reservation status.');
        console.error(err);
      }
    });
  }
  
    
addReservation() {
  // Formater les dates au format ISO 8601 avec les secondes
  const formattedStartDate = formatDate(this.newReservation.startDate, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');
  const formattedEndDate = formatDate(this.newReservation.endDate, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');

  // Préparer l'objet de réservation
  const reservationData = {
    userId: this.newReservation.userId,
    deviceId: this.newReservation.deviceId,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };

  this.http.post('http://localhost:8083/api/reservations', reservationData).subscribe(
    (response) => {
      console.log('Reservation added successfully', response);
      window.location.reload();

    },
    (error) => {
      console.error('Error adding reservation:', error);
    }
  );
}
  

  startUpdateReservation(id: number): void {
    this.editingReservation = { ...this.reservations.find(r => r.id === id) };
    this.isModalOpen = true;
  }

  saveUpdatedReservation(): void {
    this.http.put(`http://localhost:8083/api/reservations/${this.editingReservation.id}`, this.editingReservation).subscribe(
      () => {
        alert('Reservation updated successfully');
        this.isModalOpen = false;
        this.getReservations();
      },
      (error) => {
        console.error('Error updating reservation:', error);
        alert('Failed to update reservation.');
      }
    );
  }

  deleteReservation(id: number): void {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.http.delete(`http://localhost:8083/api/reservations/${id}`).subscribe(
        () => {
          alert('Reservation deleted successfully');
          this.getReservations();
        },
        (error) => {
          console.error('Error deleting reservation:', error);
          alert('Failed to delete reservation.');
        }
      );
    }
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    this.newReservation = { userId: null, deviceId: null, startDate: '', endDate: '' };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.reservations.length / this.itemsPerPage);
    this.paginatedReservations = this.reservations.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}
