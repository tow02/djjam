import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../services/authentication.service"
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  currentUser:firebase.User;
  constructor(private authen:AuthenticationService, private router:Router) { }
  q:string;
  isLoginIn = false;

  ngOnInit(): void {
    this.authen.auth.authState.subscribe(user => {
      if(user)
        this.isLoginIn = true;
      else
        this.isLoginIn = false;
      
    })
    this.router.events.subscribe(e => {
      
      if(e instanceof NavigationEnd){
        console.log("check url", this.router.url)
        let resultMatch = e.url.match(/search\/(.+)/g);
        if(resultMatch){
          console.log(resultMatch)
        this.q =  decodeURIComponent(resultMatch[0].split('/')[1]);
        }
        

      }
        
    })
  }

  logout(){
    this.authen.logout().then(() => this.router.navigate(['/login']));
  }

  search(){
    if(this.q)
      this.router.navigate(['/search', this.q]);
  }

}
