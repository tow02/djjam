import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/firestore'
import { SpotifyPlaylist } from "../services/spotify.interface"
import { AuthenticationService } from "./authentication.service"
import { Playlist } from "../models/Track"


export interface User{
  id?:string,
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
      [key:string]:Array<Playlist>
    }
  city?: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authen:AuthenticationService, private firestore:AngularFirestore) { 

    
  }

  async getUserId(){
    const id =  (await this.authen.auth.currentUser).uid;
    return id;
  }

  async get(userReference?:DocumentReference| string){
    let snap:DocumentData;
    if(userReference && typeof(userReference) === "string")
      snap = await this.firestore.collection('user').doc(userReference).get().toPromise();
    else if(userReference){
      snap = await (userReference as DocumentReference).get()
    }else{
      const user = await this.authen.auth.currentUser;
     snap = await this.firestore.collection('user').doc(user.uid).get().toPromise()
    }
    
    let u =  {
      ...snap.data(),
      id:snap.id  
    } as User
    
    return u;

  }

  async update(user:User, fields?:Array<string>){
    console.log('user', user)
    const id =  (await this.authen.auth.currentUser).uid;
    console.log(id, user, fields)
    let obj:any = {};
    if(fields)
      fields.forEach(field => obj[field] = user[field] );
    else
      obj = {...user};
    return this.firestore.collection('user').doc(id).update(obj);
  }

  nameToSlug(str:string){
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
  }


  async addPlaylistsToSet(playlists:Array<SpotifyPlaylist>, setName:string){

    const id =  (await this.authen.auth.currentUser).uid;
    const user = await this.get();
     const newPlaylists = playlists.map(item => ({
      id:item.id,
      name:item.name,
      imageUrl:item.images[0].url,
      isPublished:true
    }) as Playlist);
    console.log('going to save', newPlaylists);
    const obj:any = {playlist_set_map:{}}
    if(!user.playlist_set_map[this.nameToSlug(setName)])
      user.playlist_set_map[this.nameToSlug(setName)] = [];
    user.playlist_set_map[this.nameToSlug(setName)] = user.playlist_set_map[this.nameToSlug(setName)].concat(newPlaylists)
    
    this.firestore.collection('user').doc(id).update({
      playlist_set_map:user.playlist_set_map
    });
    return Promise.all(newPlaylists.map(item => this.firestore.collection('user').doc(id).collection('set').doc(item.id).set(item)));
  }

  async getPublishStatus(playlistId:string){
    
    const id =  (await this.authen.auth.currentUser).uid
    console.log('id', id)
    return this.firestore.collection('user').doc(id).collection('set').doc(playlistId).get().toPromise().then(res =>( res.data() as Playlist));
  }

  async setPublishStatus(playlistId:string, status:boolean){
    const id =  (await this.authen.auth.currentUser).uid
    console.log('id', id)
    return this.firestore.collection('user').doc(id).collection('set').doc(playlistId).update({isPublished: status})
  }
}
