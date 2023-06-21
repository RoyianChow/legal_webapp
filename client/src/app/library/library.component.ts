import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // import Router
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit {
  videos: any[] = [];
  sortOption: string = '';
  sortOptions = ['Title', 'Description', 'Party 1', 'Party 2'];
  searchQuery = new FormControl('');

  constructor(private http: HttpClient,private router: Router) {}
  displayedColumns: string[] = ['title', 'description', 'party1', 'party2', 'actions'];

  ngOnInit(): void {
    this.searchQuery.valueChanges.pipe(
      debounceTime(300)
    ).subscribe((newQuery) => {
      this.search();
    });

    this.http.get<any[]>('http://localhost:3000/library').subscribe(
      (response) => {
        this.videos = response;
      },
      (error) => {
        console.error('Error fetching videos:', error);
      }
    );
  }
  deleteVideo(s3key: string): void {
    this.http.delete(`http://localhost:3000/video/${s3key}`)
        .subscribe( (response) => {
          // On successful deletion, remove the video from the local array
          this.videos = this.videos.filter(video => video.s3key !== s3key);
        },
        (error) => {
          // Handle error
          console.error('Delete error:', error);
        });
      }

      editVideo(s3key: string): void {
        this.router.navigate(['/edit-video', s3key]); // navigate to the edit page
      }
      sortVideos() {
        this.videos.sort((a, b) => a[this.sortOption].localeCompare(b[this.sortOption]));
      }

      search(): void {
        this.http.get<{ title: string; description: string; s3key: string; partyNames: string[] }[]>('http://localhost:3000/search', { params: { q: this.searchQuery.value ?? '' } }).subscribe(
  (response) => {
    this.videos = response;
  },
  (error) => {
    console.error('Error fetching videos:', error);
  }
);
      }

  }
