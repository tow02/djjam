import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment'
import { AuthenticationService } from "../../services/authentication.service"
import { Router } from "@angular/router"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authen:AuthenticationService, private router:Router) { }

  email:string
  password:string
  isLogginIn = false;
  errorMessage:string = "";
  isForgetPassword = false;
  statusMessage = "";

  ngOnInit(): void {
  }

  async login(){
    console.log(this.email, this.password);
    this.isLogginIn = true;
    await this.authen.login(this.email, this.password).catch(e => {
      console.log('error',e)
      if(environment.errorMessages[e.code])
        this.errorMessage = environment.errorMessages[e.code];
      else
        this.errorMessage =  e.message;
    })
    this.isLogginIn = false;
    this.router.navigate([''])
  }

  async forgotPassword(){
    this.statusMessage = environment.statusMessaages.sending_reset_password;
    await this.authen.auth.sendPasswordResetEmail(this.email)
    this.statusMessage = environment.statusMessaages.done_sent;
  }

}
