import { Component, OnInit } from '@angular/core';
import { SpotifyService } from "../services/spotify.service"

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  constructor(private spotifyService:SpotifyService) { }

  isConnect = true;
  playlists = [];
  
  async ngOnInit() {
    this.isConnect = this.spotifyService.isConnect()
    if(this.isConnect)
    this.spotifyService.getMyWholePlaylists(playlists => {
      this.playlists = playlists;
      //console.log(this.playlists)
    })
    //console.log(playlists)
  }

}
