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

  authenWithSpotify(accessToken:string){
    return fetch(`${environment.api_url}/spotify/authentication`, {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        access_token:accessToken
      })
    })    
  }

  async signup(user:{cityName:string, communityName:string, password:string, confirmPassword:string, djName:string, email:string, spotifyUserId?:string}){
    const res =  await fetch(`${environment.api_url}/user`, {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(user)
    })
    if(res.status != 200)
      throw await res.json();
    else
      return res.json();
  }

}
