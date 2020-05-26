import { Component, OnInit } from '@angular/core';
import { TrackService } from "../services/track.service"
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
    this.trackService.onChangeTrack.subscribe(track => {
      //found a new track
      console.log('play new track?', track);
      
      this.ap =  new APlayer({
        container: document.getElementById('aplayer'),
        audio: [{
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            url: track.preview_url,
            cover: track.album.images[0].url,
            loop:'none'
        }]
      })
      this.ap.play()
    })
    /*if(this.trackKey){
      //ifHaveTrackKey init APlayer
      this.ap =  new APlayer({
        container: document.getElementById('aplayer'),
        audio: [{
            name: 'If It Ain t Love',
            artist: 'Chick Webb',
            url: 'https://p.scdn.co/mp3-preview/3b95d84ed3f9e56b4863d28ebad25eccd36c90fe?cid=bb200fb215c346448b3c34bbccaac25d',
            cover: 'https://i.scdn.co/image/ab67616d0000b273a316589b638578d23bada5b1'
        }]
    })
    }*/
  }

  /*ngOnInit(): void {
    this.ap =  new APlayer({
      container: document.getElementById('aplayer'),
      audio: [{
          name: 'If It Ain t Love',
          artist: 'Chick Webb',
          url: 'https://p.scdn.co/mp3-preview/3b95d84ed3f9e56b4863d28ebad25eccd36c90fe?cid=bb200fb215c346448b3c34bbccaac25d',
          cover: 'https://i.scdn.co/image/ab67616d0000b273a316589b638578d23bada5b1'
      }]
  });
  }*/


}
