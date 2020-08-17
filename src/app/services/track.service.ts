import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore'
import { environment } from "../../environments/environment"
import { UserService } from "./user.service"
import { Track } from "../models/Track"
import { SpotifyTrackItem } from "./spotify.interface"

export interface TrackEvent{
  track?:Track,
  spotifyTrack?:SpotifyTrackItem,
  action:"play" | "pause" | "select" | "deselect"
}

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  currentTrack:Track;
  onChangeTrack:EventEmitter<TrackEvent> = new EventEmitter<TrackEvent>();
  public playedStatusTrack:{[key:string]:boolean} ={};

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

  updateBpm(trackId:string, bpm:number){
    return  this.firestore.collection('track').doc(trackId).update({bpm:bpm});
  }

  async play(trackID:string, spotifyTrack?:SpotifyTrackItem){        
    this.currentTrack = await this.get(trackID);

    this.onChangeTrack.emit({
      track:this.currentTrack,
      spotifyTrack:spotifyTrack,
      action:"play"
    });
  }

  toggle(trackID:string, spotifyTrack?:SpotifyTrackItem){
    //reset other id to false
    Object.keys(this.playedStatusTrack).filter(id => id!=trackID).forEach(id => this.playedStatusTrack[id] = false);
    if(!this.playedStatusTrack[trackID])
      this.playedStatusTrack[trackID] = true;
    else
      this.playedStatusTrack[trackID] = false;
    if(this.playedStatusTrack[trackID])
      return this.play(trackID, spotifyTrack)
    else
      return this.pause();
  }

  pause(){
    this.onChangeTrack.emit({
      track:this.currentTrack,
      action:'pause'
    })
  }

  async select(trackID:string, spotifyTrack?:SpotifyTrackItem){
      
    this.currentTrack = await this.get(trackID);
    this.onChangeTrack.emit({
      track:this.currentTrack,
      action:"select",
      spotifyTrack:spotifyTrack
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

  async convertTagToPersonalTag(nameTag:string){
    let token = await this.userService.getUserId()
    return `${token}-${nameTag.toLocaleLowerCase()}`;
  }

  async updatePersonaltags(trackId:string, tags:Array<string>, isAdd:boolean = true){
    //personal_tags.
    let obj:any = {};
    obj['personal_tags'] = {}
    for(let i =0; i < tags.length;i++){
      let tag = tags[i];
      let personalTag = await this.convertTagToPersonalTag(tag)
      obj['personal_tags'][personalTag] = isAdd;
    }
    return this.firestore.collection('track').doc(trackId).update(obj)
  }

  


}
