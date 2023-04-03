import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user';
import { Exam } from './exam';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class ExamService {

  private userUrl = 'http://localhost:5000';  // URL to REST API

    // API url
    baseApiUrl = "https://file.io"

  constructor(private http: HttpClient) { }


    // File upload Returns an observable
    upload(file: File):Observable<any> {
  
      // Create form data
      const formData = new FormData(); 
        
      // Store form name as "file" with file data
      formData.append("file", file, file.name);
        
      // Make http post request over api
      // with formData as req
      return this.http.post(this.baseApiUrl, formData)
  }


   /** login */
  login(user: User): Observable<any> {
    return this.http.post<any>(this.userUrl + '/login', user, httpOptions);
  }
  
  /** GET users from the server */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl + '/users');
  }

   /** GET exams from the server */
   getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.userUrl + '/exams');
  }
  
  /** GET user by id. Will 404 if id not found */
  getUser(id: number): Observable<any> {

      const url = `${this.userUrl}/user/${id}`;
      return this.http.get<User>(url);

    
  }

  /** GET exam by id. Will 404 if id not found */
  getExam(examID: number): Observable<any> {

      const url = `${this.userUrl}/exam/${examID}`;
      return this.http.get<Exam>(url);
    

    
  }


  
  /** POST: add a new user to the server */
  addUser(user: User) {
	//console.log(user);
    return this.http.post(this.userUrl + '/add', user, httpOptions);
  }

  /** POST: add a new exam to the server */
  addExam(exam: Exam) {
    //console.log(user);
      return this.http.post(this.userUrl + '/examadd', exam, httpOptions);
    }
  
  /** PUT: update the user on the server */
  updateUser(user: User): Observable<any> {
    return this.http.put(this.userUrl + '/update', user, httpOptions);
  }

   /** PUT: update the user on the server */
   updateExam(exam: Exam): Observable<any> {
    if(confirm("exam name: "+exam.examName+ "exam ID: "+exam.examID)){
    return this.http.put(this.userUrl + '/examedit', exam, httpOptions);
    }
    return of({});
  }
  
  /** DELETE: delete the user from the server */
  deleteUser(user: User | number) {
	  if (confirm("Are you sure to delete?")) {
		const id = typeof user === 'number' ? user : user.id;
		const url = `${this.userUrl}/delete/${id}`;
		return this.http.delete(url, httpOptions);
	  }
	  return of({});
  }

  deleteExam(exam: Exam | number) {
	  if (confirm("Are you sure to delete?")) {
		const examID = typeof exam === 'number' ? exam : exam.examID;
		const url = `${this.userUrl}/examdelete/${examID}`;
		return this.http.delete(url, httpOptions);
	  }
	  return of({});
  }
}