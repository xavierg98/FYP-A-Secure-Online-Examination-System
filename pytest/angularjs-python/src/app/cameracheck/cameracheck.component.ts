//import { Component } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CameracheckService } from '../cameracheck.service';

//@Component({
 // selector: 'app-cameracheck',
  //templateUrl: './cameracheck.component.html',
  //styleUrls: ['./cameracheck.component.css']
//})

@Component({
  selector: 'app-cameracheck',
  templateUrl: './cameracheck.component.html',
  styleUrls: ['./cameracheck.component.css'],
  template: `
      <a routerLink="{{ urls.video_feed }}">Video Feed</a>
      <a routerLink="{{ urls.video_feedreg }}">Video Feedreg</a>
      <a routerLink="{{ urls.taskstu }}">Taskstu</a>     
      <video [src]="videoUrl" autoplay></video>
      '<video [src]="videoUrl" autoplay></video>'
  `
})

export class CameracheckComponent implements OnInit {
  urls: any;
  videoUrl: any;
  

  constructor(private http: HttpClient,private CameracheckService: CameracheckService) {}
  

  ngOnInit() {
      this.http.get('/urls').subscribe(data => {
          this.urls = data;

          this.CameracheckService.getvideo_feed().subscribe((video) => {
            this.videoUrl = URL.createObjectURL(video);    
      });;    
});
  }};
    
