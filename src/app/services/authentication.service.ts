import { Injectable } from '@angular/core';
import { AngularFireAuth  } from '@angular/fire/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(public auth:AngularFireAuth) { }

  currentUser:firebase.auth.UserCredential;

  login(email:string, password:string){
    return this.auth.signInWithEmailAndPassword(email, password).then(userCred => {
      this.currentUser = userCred;
      return userCred;
    })
  }

  logout(){
    return this.auth.signOut();
  }


}
