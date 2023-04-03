import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { Exam } from '../exam';
import { UserService } from '../user.service';
import { ExamService } from '../exam.service';



@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit{
  
	SessionUserame=localStorage.getItem('SessionUserame');
	SessionUseremail=localStorage.getItem('SessionUseremail');

  users: User[] = [];
  exams: Exam[] = [];

	constructor(private route: ActivatedRoute, private userService: UserService, private examService: ExamService) { }

	ngOnInit() {
		this.getUsers();
		this.getExams();
	}

	getUsers(): void {
		this.userService.getUsers().subscribe(users => this.users = users);
	}

	getExams(): void {
		this.examService.getExams().subscribe(exams => this.exams = exams);
	}
  
	delete(exam: Exam): void {
		this.examService.deleteExam(exam).subscribe(success=> {this.getExams();});		
	}

}
