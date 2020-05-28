import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../services/authentication.service"
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  currentUser:firebase.User;
  constructor(private authen:AuthenticationService, private router:Router) { }

  isLoginIn = false;

  ngOnInit(): void {
    this.authen.auth.authState.subscribe(user => {
      if(user)
        this.isLoginIn = true;
      else
        this.isLoginIn = false;
      
    })
  }

  logout(){
    this.authen.logout().then(() => this.router.navigate(['/login']));
  }

}
