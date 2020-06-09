import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment"
import { AngularFireAuth  } from '@angular/fire/auth'


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(public auth:AngularFireAuth) { }

  clearToken(){
    delete localStorage[ environment.localstorage.spotify_age ] ;
    delete localStorage[ environment.localstorage.spotify_expire_in ];
    delete localStorage[ environment.localstorage.spotify_access_token ];
  }

  login(email:string, password:string){
    return this.auth.signInWithEmailAndPassword(email, password).then(userCred => {
      return userCred;
    })
  }

  logout(){
    this.clearToken();
    return this.auth.signOut();
  }

  signup(user:{cityName:string, communityName:string, password:string, confirmPassword:string, djName:string, email:string}){
    return fetch(`${environment.api_url}/user`, {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:JSON.stringify(user)
    }).then(res => res.json())
  }

}
