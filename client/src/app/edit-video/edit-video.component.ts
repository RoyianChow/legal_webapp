import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.css'],
})
export class EditVideoComponent implements OnInit {
  form: FormGroup;
  s3key: string = '';
  video: File | null = null;
  updateSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: [''],
      description: [''],
      party1: [''],
      party2: ['']
    });
  }

  ngOnInit(): void {
    this.s3key = this.route.snapshot.params['s3key'];
    this.http.get<any>(`http://localhost:3000/video/${this.s3key}`).subscribe(
      (response) => {
        this.form.patchValue({
          title: response.title,
          description: response.description,
          party1: response.party1,
          party2: response.party2
        });
      },
      (error) => {
        console.error('Error fetching video:', error);
      }
    );
  }

  handleFileInput(event: any): void {
    this.video = event.target.files[0];
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('title', this.form.get('title')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('partyNames', JSON.stringify([this.form.get('party1')?.value, this.form.get('party2')?.value]));
    if (this.video) {
      formData.append('video', this.video);
    }
    this.http
      .put(`http://localhost:3000/video/${this.s3key}`, formData)
      .subscribe(
        (response) => {
          this.updateSuccess = true;
        },
        (error) => {
          console.error('Update error:', error);
        }
      );
  }

  closeUpdateSuccessMessage(): void {
    this.updateSuccess = false;
  }
}
