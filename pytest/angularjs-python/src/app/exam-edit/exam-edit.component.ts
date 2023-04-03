import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { User } from '../user';
import { UserService } from '../user.service';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-exam-edit',
  templateUrl: './exam-edit.component.html',
  styleUrls: ['./exam-edit.component.css']
})
export class ExamEditComponent implements OnInit{

  @Input() user = new User;
  exam = new Exam;
  SessionUserame=localStorage.getItem('SessionUserame');
  SessionUseremail=localStorage.getItem('SessionUseremail');

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
		const id = + Number(this.route.snapshot.paramMap.get('id'));
		this.examService.getExam(id).subscribe(exam => this.exam = exam);
	}
	
	save(): void {		
		this.examService.updateExam(this.exam).subscribe(success=> {this.goBack();});
	}

	goBack(): void {
		this.location.back();
	}


}
