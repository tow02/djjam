import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore'
import { UserData } from "../models/User"
import { AuthenticationService } from "./authentication.service"

export interface User{
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
    playlist_set_map?:{
      [key:string]:Array<{
        name:string,
        image:string,
        id:string
      }>
    }
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

  async update(user:User, fields?:Array<string>){
    const id =  (await this.authen.auth.currentUser).uid;
    console.log(id, user, fields)
    let obj:any = {};
    if(fields)
      fields.forEach(field => obj[field] = user[field] );
    else
      obj = {...user};
    console.log(obj);
    if(obj['community']){  
        let result = await  this.firestore.collection('community') .doc(user.community['name']).get().toPromise()
        if(!result.exists)
          await this.firestore.collection('community') .doc(user.community['name']).set({
            name:user.community['name'],
            city:user.community['city']
          })
      obj['community'] = this.firestore.collection('community') .doc(user.community['name']).ref;
    }
    console.log('going to update', obj);
    return this.firestore.collection('user').doc(id).update(obj);
  }

}
