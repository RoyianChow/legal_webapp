import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  videoId: string = '';
  videoUrl: string = '';
  videoTitle: string = '';

  constructor(private route: ActivatedRoute, private videoService: VideoService) { }

  ngOnInit(): void {
    const s3keyParam = this.route.snapshot.paramMap.get('id');

    if (s3keyParam) {
      this.videoId = s3keyParam;
      this.videoUrl = 'https://legalproceedingbucket.s3.us-east-2.amazonaws.com/' + s3keyParam;

      this.videoService.getVideo(this.videoId).subscribe(
        (video) => {
          this.videoTitle = video.title;
        },
        (error) => {
          console.error('Error fetching video:', error);
        }
      );
    } else {
      console.error('Video ID is null');
    }
  }
}
