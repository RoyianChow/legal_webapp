import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  title = '';
  description = '';
  party1 = '';
  party2 = '';
  video: File | null = null;
  uploadSuccess = false;  // New variable

  constructor(private http: HttpClient,private snackBar: MatSnackBar) {}
  closeUploadSuccessMessage(): void {
    this.uploadSuccess = false;
  }
  handleFileInput(event: any): void {
    this.video = event.target.files[0];
  }

  onSubmit(): void {
    if (!this.video) return;

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('partyNames', JSON.stringify([this.party1, this.party2]));
    formData.append('video', this.video);
    // Update the uploadUrl variable with the correct URL
const uploadUrl = 'http://localhost:3000/upload';

// Send the HTTP request to the updated URL
this.http.post(uploadUrl, formData).subscribe(
  (response) => {
    // Handle the successful response
    console.log('Upload success:', response);
    this.uploadSuccess = true;  // Set uploadSuccess to true

  },
  (error) => {
    // Handle the error
    console.error('Upload error:', error);
  }
);

  }
}
