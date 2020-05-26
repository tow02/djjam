import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'

import { Track } from "../models/Track"


@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private _currentTrackId:string;
  onChangeTrack:EventEmitter<Track> = new EventEmitter<Track>();

  constructor(private firestore:AngularFirestore) {
  
   }

   get(trackId:string){
    return  this.firestore.collection('track').doc(trackId).get().toPromise().then(snap => ({...snap.data(), id:snap.id} as Track) );
  }

    async play(trackID:string){
      
      let track = await this.get(trackID);
      if(!this._currentTrackId || this._currentTrackId != trackID){
        this.onChangeTrack.emit(track);
      }
       return track;
    }


}
