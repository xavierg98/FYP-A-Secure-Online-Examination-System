import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { User } from '../user';
import { UserService } from '../user.service';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';


@Component({
	selector: 'app-exam-detail',
	templateUrl: './exam-detail.component.html',
	styleUrls: ['./exam-detail.component.css']
})
export class ExamDetailComponent implements OnInit {

	@Input() user = new User;
	exam = new Exam;
	SessionUserame = localStorage.getItem('SessionUserame');
	SessionUseremail = localStorage.getItem('SessionUseremail');

	// Variable to store shortLink from api response
	shortLink: string = "";
	loading: boolean = false; // Flag variable
	file!: File | null |undefined ; // Variable to store file

	constructor(private route: ActivatedRoute, private userService: UserService, private location: Location, private examService: ExamService,) { }

	ngOnInit() {
		this.getUser();
		this.getExam();
	}

	getUser(): void {
		const id = + Number(this.route.snapshot.paramMap.get('id'));
		this.userService.getUser(id).subscribe(user => this.user = user);
	}

	getExam(): void {
		const examID = + Number(this.route.snapshot.paramMap.get('id'));
		this.examService.getExam(examID).subscribe(exam => this.exam = exam);
	}

	save(): void {
		this.examService.updateExam(this.exam).subscribe(success => { this.goBack(); });
	}

	goBack(): void {
		this.location.back();
	}

	// On file Select
    onChange = (event:Event) =>{

		const target = event.target as HTMLInputElement;

        this.file = target.files![0];
    }
  
    // OnClick of button Upload
    onUpload() {
        this.loading = !this.loading;
        console.log(this.file);
        this.examService.upload(this.file!).subscribe(
            (event: any) => {
                if (typeof (event) === 'object') {
  
                    // Short link via api response
                    this.shortLink = event.link;
  
                    this.loading = false; // Flag variable 
                }
            }
        );
    }


}
