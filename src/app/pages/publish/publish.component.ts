import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpotifyPlaylist } from "../../services/spotify.interface"
import { SpotifyService } from "../../services/spotify.service"
import { UserService } from "../../services/user.service"

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit, OnDestroy {

  constructor(private spotifyService:SpotifyService, private userService:UserService) { }

  playlists:Array<{playlist:SpotifyPlaylist, selected:boolean}> 

  

  async ngOnInit() {
    this.playlists = await (await this.spotifyService.getMyWholePlaylists()).map(playlist => ({
      playlist:playlist,
      selected:false
    }));
    console.log('playlists', this.playlists)
  }

  ngOnDestroy(){
    console.log('destory')
  }

  toogle(index){

  }

}
