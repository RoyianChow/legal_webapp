import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private baseUrl = 'http://localhost:3000';  // replace with your API URL

  constructor(private http: HttpClient) {}

  getVideo(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/videos/${id}`);

  }

}
