import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SpotifyService } from "../../services/spotify.service"
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  playlistId:string;
  constructor(private route:ActivatedRoute, private spotifyService:SpotifyService) { 
    this.route.params.subscribe(p => {
      this.playlistId = p['id']      
      this.spotifyService.getPlaylist(this.playlistId).then(playlists => console.log(playlists));
      

    })
  }

  async ngOnInit() {
    console.log('hi')
    let playlist = await this.spotifyService.getPlaylist(this.playlistId);
    console.log("Tracks", playlist.tracks);
  }

}
