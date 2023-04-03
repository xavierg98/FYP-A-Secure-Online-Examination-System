import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {HttpClient} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
//import DailyIframe from '@daily-co/daily-js';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit{

  user = new User;
  externalHtml!: SafeHtml;



	/*callFrame = window.DailyIframe.createFrame({
	  showLeaveButton: true,
	  iframeStyle: {
		position: 'fixed',
		top: '0',
		left: '0',
		width: '100%',
		height: '100%',
	  },
	});
	*/






	constructor(private route: ActivatedRoute, private userService: UserService, private location: Location, private http: HttpClient, private sanitizer: DomSanitizer) { }
	
	ngOnInit() {
		this.getUser();

		//this.http.get('../src/app/user-detail/abc.html', { responseType: 'text' }).subscribe(res=>{
			//this.externalHtml = this.sanitizer.bypassSecurityTrustHtml(res)
//	 } );

		
		//this.callFrame.join({ url: 'https://louiy.daily.co/OnlineExam_session' });


		window.location.href = "http://localhost:8000/TestExamples/onlineTest/abc.html"
	}
	
	getUser(): void {
		const id = + Number(this.route.snapshot.paramMap.get('id'));
		this.userService.getUser(id).subscribe(user => this.user = user);
	}

	goBack(): void {
		this.location.back();
	}

}
