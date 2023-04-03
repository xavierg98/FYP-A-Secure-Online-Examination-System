import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';  
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit{

  @Input() user= new User
  user2 = new User;
  message!: string;  
  returnUrl="/examlist";
  loggin!: string | null;
  SessionUserame!:string;
  SessionUseremail!:string;
  
 
  
	constructor(private route: ActivatedRoute, 
              private userService: UserService, 
              private location: Location,
              private router: Router,) { }

	ngOnInit() {

	}


  save(): void {
      this.userService.login(this.user).subscribe(user => {this.user2 = user
      if(this.user2.id!=null){
        localStorage.setItem("isLoggedIn","Logged In");
    
        localStorage.setItem('SessionUserame', this.user2.name!);
        localStorage.setItem('SessionUseremail', this.user2.email!);
        //localStorage.setItem('UserID', (this.user.id!));
        this.router.navigate([this.returnUrl]);  

      }})
      
      //buggy
      if(this.user2.id==null){
        this.message="Invalid user"
      }
      


}

  goBack(): void {
  this.location.back();
}


}