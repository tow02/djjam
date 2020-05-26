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
  constructor(private trackService:TrackService) { 
    
  }


  

  ngOnInit():void{
    console.log('initTrackPlayer')
    this.trackService.onChangeTrack.subscribe((e:TrackEvent ) => {
      
      //found a new track
      console.log('play new track?', e);
      let track = e.track
      if(e.action == 'play' || e.action == 'select')
      this.ap =  new APlayer({
        container: document.getElementById('aplayer'),
        audio: [{
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            url: track.preview_url,
            cover: track.album.images[0].url,
        }],
        loop:'none'
      })
      if(e.action == "play")
        this.ap.play()
      if(e.action == "pause" )
        this.ap.pause();
    })
    
  }

}
