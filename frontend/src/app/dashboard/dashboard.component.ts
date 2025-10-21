import { CommonModule, formatDate } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

interface Device {
  id: number;
  name: string;
  serialNumber: string;
  departmentId: number;
  imageUrl: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {

  devices: Device[] = [];
  apiUrl = '/api/devices';              // <— RELATIF
  uploadsBase = '/api/uploads/';        // <— via Nginx -> backend
  isModalOpen = false;
  newReservation: any = { startDate: '', endDate: '', userId: '', deviceId: '' };

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getSafeUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.uploadsBase + imageUrl);
  }

  ngOnInit(): void {
    this.fetchDevices();
    const userid = localStorage.getItem('userid');
    console.log('userid:', userid ?? '(none)');
  }

  fetchDevices(): void {
    this.http.get<Device[]>(this.apiUrl).subscribe({
      next: (res) => this.devices = res,
      error: (err) => console.error('Error fetching devices:', err)
    });
  }

  openModal(deviceId: number): void {
    this.isModalOpen = true;
    this.newReservation.deviceId = deviceId;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.newReservation.startDate = '';
    this.newReservation.endDate = '';
  }

  addReservation(deviceId: number): void {
    const userid = localStorage.getItem('userid');
    // Si le backend déduit l’utilisateur depuis le JWT, tu peux omettre userId.
    // Sinon, on l’envoie :
    if (!userid) {
      alert('You must be logged in.');
      return;
    }

    const today = new Date();
    const startDate = new Date(this.newReservation.startDate);
    const endDate = new Date(this.newReservation.endDate);

    if (startDate > endDate) {
      alert('Start Date cannot be later than End Date');
      return;
    }
    // Compare sans l’heure (optionnel)
    if (startDate < today || endDate < today) {
      alert('Start Date and End Date must be today or in the future');
      return;
    }

    const formattedStartDate = formatDate(this.newReservation.startDate, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');
    const formattedEndDate   = formatDate(this.newReservation.endDate,   "yyyy-MM-dd'T'HH:mm:ss", 'en-US');

    const reservationData = {
      userId: Number(userid),           // garde si ton API le demande
      deviceId: deviceId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    this.http.post('/api/reservations', reservationData).subscribe({
      next: (res) => {
        console.log('Reservation added:', res);
        this.closeModal();
      },
      error: (err) => {
        alert('There is already a reservation for this device during the selected dates.');
        console.error('Error adding reservation:', err);
      }
    });
  }
}
