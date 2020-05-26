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
  onChangeTrack:EventEmitter<TrackEvent> = new EventEmitter<TrackEvent>();

  constructor(private firestore:AngularFirestore) {
  
   }

   get(trackId:string){
    return  this.firestore.collection('track').doc(trackId).get().toPromise().then(snap => ({...snap.data(), id:snap.id} as Track) );
  }

  private isChangeTrack(trackID:string){
      return !this._currentTrackId || this._currentTrackId != trackID;
  }

  async play(trackID:string){    
    const isPlay = this.isChangeTrack(trackID);
      if(isPlay){
        const track = await this.get(trackID);
        this.onChangeTrack.emit({
          track:track,
          action:"play"
        });
      }
      return isPlay;
  }

  async select(trackID:string){
    const isChange = this.isChangeTrack(trackID);
    if(isChange){
      const track = await this.get(trackID);
      this.onChangeTrack.emit({
        track:track,
        action:"select"
      });
    }
    return isChange;
  }


}
