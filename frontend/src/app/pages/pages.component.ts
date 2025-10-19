import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
interface ReservationDto {
  id: number;
  userId: number;
  deviceId: number;
  startDate: string;
  endDate: string;
  status: string;
}
@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css',
})


export class PagesComponent implements OnInit {
  reservations: ReservationDto[] = []; // Initialize reservations array

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userid');
    if (!userId) {
      console.error('User not logged in');
      return;
    }
    this.getReservationsByUserId(parseInt(userId));
  }

  getReservationsByUserId(userId: number): void {
    this.http.get<ReservationDto[]>(`http://localhost:8083/api/reservations/user/${userId}`).subscribe({
      next: (reservations) => {
        console.log(reservations);
        // Filter reservations with status 'reserved'
        this.reservations = reservations.filter(reservation => reservation.status === 'reserved');
      },
      error: (err) => {
        console.error('Error fetching reservations:', err);
      }
    });
  }
}
