import { Component, OnInit } from '@angular/core';
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

  ngOnInit(): void {
  }

  async login(){
    console.log(this.email, this.password);
    
    await this.authen.login(this.email, this.password)
    this.router.navigate([''])
  }

}
