import { Component, OnChanges, Input } from '@angular/core';
import { SpotifyService } from "../../services/spotify.service"
import { PlaylistEvent } from "../playlist.event.interface"

@Component({
  selector: 'artists-character',
  templateUrl: './artists-character.component.html',
  styleUrls: ['./artists-character.component.css']
})
export class ArtistsCharacterComponent implements OnChanges {

  @Input()
  playlistEvent:PlaylistEvent

  constructor(private spotifyService:SpotifyService) { }

  ngOnChanges(): void {
    if(this.playlistEvent.status == "done"){
      const info = this.spotifyService.getArtistsInfomation(this.playlistEvent.playlist);
      console.log(Object.keys(info).map(item => ({name:info[item].name, count:info[item].count })).sort( (a,b) => {
        if(a.count > b.count)
          return -1
        else
          return 1;
      }));
    }
      

  }

}
