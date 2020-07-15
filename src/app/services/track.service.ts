import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore'
import { environment } from "../../environments/environment"
import { UserService } from "./user.service"
import { Track } from "../models/Track"
import { env } from 'process';

export interface TrackEvent{
  track:Track,
  action:"play" | "pause" | "select" | "deselect"
}

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  currentTrack:Track;
  onChangeTrack:EventEmitter<TrackEvent> = new EventEmitter<TrackEvent>();

  constructor(private firestore:AngularFirestore, private userService:UserService) {
  
   }

   get(trackId:string){
    return  this.firestore.collection('track').doc(trackId).get().toPromise().then(snap => 
      {
        if(snap && snap.exists)
          return ({...snap.data(), id:snap.id} as Track)
        else
          return null;
      }
     );
  }

  async play(trackID:string){        
    this.currentTrack = await this.get(trackID);
    this.onChangeTrack.emit({
      track:this.currentTrack,
      action:"play"
    });
  }

  pause(){
    this.onChangeTrack.emit({
      track:this.currentTrack,
      action:'pause'
    })
  }

  async select(trackID:string){
      
    this.currentTrack = await this.get(trackID);
    this.onChangeTrack.emit({
      track:this.currentTrack,
      action:"select"
    });
  }

  deSelect(){
    this.onChangeTrack.emit({
      track:this.currentTrack,
      action:"deselect"
    }) 
    delete this.currentTrack;
    
  }

  //fucking expensive loader
  async getCommunityPlaylists(){
    let snap = await this.firestore.collection('community_playlist', ref => ref.orderBy('created', 'desc')).get().toPromise()
    return Promise.all( snap.docs.map(doc => doc.data() as {
      by:DocumentReference,
      id:string,
      imageUrl:string,
      name:string
    }).map(async (item )=> ({...item, by:(await this.userService.get(item.by))})));
    
  }

  async getStaffPicks(){
    return fetch(`${environment.api_url}/staffPicks`).then(res => res.json()).then(res =>  res as Array<{
      "Name":string,
      "Playlist ID":string,
      "Notes":string,
      "Cover":Array<{
        url:string
      }>,
      "DJ Name":string,
      "DJ ID":string
    }>);  
  }


}
