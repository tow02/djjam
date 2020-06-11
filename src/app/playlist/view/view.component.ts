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
      this.render();
    })
  }

  async render(){
    if(this.spotifyService.isConnect()){
      let playlist = await this.spotifyService.getPlaylist(this.playlistId)

      this.playlistEvent.status = "loading";
      if(playlist){
        let item = await this.spotifyService.getPlaylistInformations(playlist)
        this.playlistEvent = { status:"done"};
        this.playlistEvent.playlist = playlist
        this.playlistEvent.djjamTracks = item.djjamTracks;
        this.playlistEvent.audioFeatures = item.audioFeatures;
        
      }
    }
  }

  async ngOnInit() {
    
  }

  listen(){
    window.location.href =  this.playlistEvent.playlist.external_urls.spotify
    //console.log(this.playlistEvent.playlist.external_urls.spotify)
  }

}
