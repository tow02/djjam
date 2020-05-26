import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Track } from "../models/Track"

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  constructor(private firestore:AngularFirestore) { }


   get(trackId:string){
    return  this.firestore.collection('track').doc(trackId).get().toPromise().then(snap => snap.data() as Track);
  
  }
}
