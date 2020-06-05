import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { UserService } from "../../services/user.service"
import { Playlist } from "../../models/Track"

interface ProfilePlaylistSet{
  name:string
  playlists:Array<Playlist>
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private userService:UserService, private router:Router) { }

  sets:Array<ProfilePlaylistSet> = []

  async ngOnInit() {
    let user = await this.userService.get();
    if(user.playlist_sets){
      this.sets = user.playlist_sets.filter(setName => user.playlist_set_map && user.playlist_set_map[this.userService.nameToSlug(setName)] ).map(setName => {
        if(user.playlist_set_map[this.userService.nameToSlug(setName)])
          return {
            name:setName,
            playlists:user.playlist_set_map[this.userService.nameToSlug(setName)]
          } as ProfilePlaylistSet
        else
          return {
            name:setName,
            playlists:[]
          } as ProfilePlaylistSet
      }).filter(item => item.playlists.length > 0)
      console.log(this.sets)
    }
  }

  select(playlist:Playlist){
    this.router.navigate(['/playlist', playlist.id]);
  }

}
