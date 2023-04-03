import { Component, OnInit, Input  } from '@angular/core';
import { Location } from '@angular/common';

import { User } from '../user';
import { UserService } from '../user.service';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';



@Component({
  selector: 'app-exam-add',
  templateUrl: './exam-add.component.html',
  styleUrls: ['./exam-add.component.css']
})
export class ExamAddComponent implements OnInit {
  @Input() exam = new Exam;
  SessionUserame=localStorage.getItem('SessionUserame');
  SessionUseremail=localStorage.getItem('SessionUseremail');
	
	// Variable to store shortLink from api response
	shortLink: string = "";
	loading: boolean = false; // Flag variable
	file!: File | null |undefined ; // Variable to store file

	constructor(private userService: UserService, private location: Location,  private examService: ExamService) { }

	ngOnInit() {
	}
	
	save(): void {
		
		this.examService.addExam(this.exam).subscribe(() => this.goBack());
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

					this.exam.examPaperId=this.shortLink ;
                }
            }
        );
		

		
    }




}
