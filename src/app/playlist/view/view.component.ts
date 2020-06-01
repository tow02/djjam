import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SpotifyService } from "../../services/spotify.service"
import { PlaylistEvent } from "../playlist.event.interface"

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  playlistId:string;
  playlistEvent:PlaylistEvent = { status:"loading"};

  constructor(private route:ActivatedRoute, private spotifyService:SpotifyService) { 
    this.route.params.subscribe(p => {
      this.playlistId = p['id']      
      if(this.spotifyService.isConnect()){
        this.spotifyService.getPlaylist(this.playlistId).then(playlist =>{
          this.playlistEvent.status = "loading";
           if(playlist){
             this.spotifyService.getPlaylistInformations(playlist).then(item => {
               this.playlistEvent = { status:"done"};
               this.playlistEvent.playlist = playlist
               console.log('playlist tracks', playlist.tracks)
               this.playlistEvent.djjamTracks = item.djjamTracks;
                this.playlistEvent.audioFeatures = item.audioFeatures;
                console.log('load done', this.playlistEvent)
             })
          }
      });
      }
    })
  }

  async ngOnInit() {
    
  }

}
