import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'

import { Track } from "../models/Track"

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

  constructor(private firestore:AngularFirestore) {
  
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

  getCommunityPlaylists(){
    this.firestore.collection('')
  }


}
