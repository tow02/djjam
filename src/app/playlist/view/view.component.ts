import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SpotifyPlaylist } from "../../services//spotify.interface"
import { SpotifyService } from "../../services/spotify.service"

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  playlistId:string;
  playlist:SpotifyPlaylist;

  constructor(private route:ActivatedRoute, private spotifyService:SpotifyService) { 
    this.route.params.subscribe(p => {
      this.playlistId = p['id']      
      if(this.spotifyService.isConnect()){
        this.spotifyService.getPlaylist(this.playlistId).then(playlists =>{
           this.playlist = playlists
           console.log('yo')
           if(this.playlist){
             console.log(this.playlist)
             this.spotifyService.getPlaylistInformations(this.playlist).then(item => console.log(item))
             
          }
          
          
      });

      }
        
      

    })
  }

  async ngOnInit() {
    console.log('hi', this.playlist)
    
    
    
  }

}
