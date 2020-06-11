import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { UserService, User } from "../../services/user.service"
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

  uid:string;
  user:User;
  async ngOnInit() {
    
    this.user = await this.userService.get();
    this.uid = await this.userService.getUserId();
    console.log(this.user)
    if(this.user.playlist_sets){
      this.sets = this.user.playlist_sets.filter(setName => this.user.playlist_set_map && this.user.playlist_set_map[this.userService.nameToSlug(setName)] ).map(setName => {
        if(this.user.playlist_set_map[this.userService.nameToSlug(setName)])
          return {
            name:setName,
            playlists:this.user.playlist_set_map[this.userService.nameToSlug(setName)]
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
