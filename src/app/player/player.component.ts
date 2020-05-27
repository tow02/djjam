import { Component, OnInit } from '@angular/core';
import { TrackService, TrackEvent } from "../services/track.service"
import APlayer from 'aplayer';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
 
  ap;
  isPlaying = false;
  currentPlayingId:string;
  constructor(private trackService:TrackService) { 
  
  }

  ngOnInit():void{
    console.log('initTrackPlayer')
    this.ap =  new APlayer({
      container: document.getElementById('aplayer'),
      loop:'none'
    })
    
    this.trackService.onChangeTrack.subscribe((e:TrackEvent ) => {
      
      //found a new track
      console.log('play new track?', e);
      let track = e.track
      if(e.action == 'play' || e.action == 'select')
        if(this.isPlaying){
          this.ap.pause();
          
        }
        this.ap =  new APlayer({
          container: document.getElementById('aplayer'),
          audio:[{
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            url: track.preview_url,
            cover: track.album.images[0].url,
            id:track.id
        }],
          loop:'none'
        })
      
        /*this.ap.list.add([{
              name: track.name,
              artist: track.artists.map(a => a.name).join(', '),
              url: track.preview_url,
              cover: track.album.images[0].url,
              id:track.id
          }])*/
      if(e.action == "play"){
        if(this.currentPlayingId != e.track.id){
          this.ap.skipForward();
        }
        this.ap.play()
        this.isPlaying = true;
        this.currentPlayingId = e.track.id;
      }
        
      if(e.action == "pause" ){
        this.ap.pause();
        this.isPlaying = false;
      } 
        
        

      
    })
    
  }

}
