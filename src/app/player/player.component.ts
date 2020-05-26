import { Component, Input, OnChanges } from '@angular/core';
import APlayer from 'aplayer';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnChanges {
 
  @Input()
  trackKey:string;


  ap;
  constructor() { 
    
  }


  ngOnChanges():void{
    if(this.trackKey){
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
    }
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
