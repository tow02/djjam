import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore'
import { UserData } from "../models/User"
import { AuthenticationService } from "./authentication.service"

interface User{
  name?:string,
    picture?:string,
    level:number,
    preference_tags:Array<string>,
    exclude_tags?:Array<string>,
    playlist_sets?:Array<string>
    recent_playlists?:Array<{
        name:string,
        image:any,
        spotify_user_id:string,
        spotify_playlist_id:string
    }>
  community:DocumentReference | { name:string, city:string}
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authen:AuthenticationService, private firestore:AngularFirestore) { 

    
  }

  async get(){
    const user = await this.authen.auth.currentUser;
    const snap = await this.firestore.collection('user').doc(user.uid).get().toPromise()
    let u =  {
      ...snap.data(),
    } as User

    const citySnap = await (u.community as DocumentReference).get()
    u.community = citySnap.data() as  { name:string, city:string}
    return u;

  }

}
