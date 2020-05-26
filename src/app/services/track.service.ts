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

  private _currentTrackId:string;
  currentTrack:Track;
  onChangeTrack:EventEmitter<TrackEvent> = new EventEmitter<TrackEvent>();

  constructor(private firestore:AngularFirestore) {
  
   }

   get(trackId:string){
    return  this.firestore.collection('track').doc(trackId).get().toPromise().then(snap => ({...snap.data(), id:snap.id} as Track) );
  }

  private isChangeTrack(trackID:string){
      return !this.currentTrack || this.currentTrack.id != trackID;
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


}
