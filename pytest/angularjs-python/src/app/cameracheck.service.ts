import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CameracheckService {

  private videoUrl = 'http://localhost:5000/video_feed';
  

  constructor(private http: HttpClient) { }

  
  getvideo_feed(): Observable<Blob> {
    return this.http.get(this.videoUrl, { responseType: 'blob' });
  }
}
//import { Injectable } from '@angular/core';

//@Injectable({
//  providedIn: 'root'
//})
//export class CameracheckService {

//  constructor() { }
//}
