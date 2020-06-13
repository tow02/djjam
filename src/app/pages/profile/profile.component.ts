import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { UserService, User } from "../../services/user.service"
import { AuthenticationService } from "../../services/authentication.service"
import { environment } from "../../../environments/environment"
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

  constructor(private userService:UserService, private router:Router, private route:ActivatedRoute, private authen:AuthenticationService) { 
    this.route.params.subscribe(params => {
      if(params['uid'])
        this.uid = params.uid;
    })
    this.authen.auth.authState.subscribe(u => {
      if(u )
        this.isLogin = true;
      else
        this.isLogin = false;
    })
  }

  SET_VIEW_LIMIT = 6;
  sets:Array<ProfilePlaylistSet> = []
  positions:Array<number> = [];
  isLogin = false;
  uid:string;
  user:User;
  async ngOnInit() {
    if(!this.uid){
      this.user = await this.userService.get();
      this.uid = await this.userService.getUserId();
    }else{
      this.user = await this.userService.get(this.uid);
    }
    
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
      this.positions = new Array(this.sets.length).fill(0);
      
      console.log(this.sets)
    }
  }

  select(playlist:Playlist){
    if(this.isLogin)
      this.router.navigate(['/playlist', playlist.id]);
    else
      window.location.href = `https://open.spotify.com/playlist/${playlist.id}`
  }

  next(i:number){
    console.log(this.positions)
    this.positions[i] = this.positions[i] - 100;
    document.getElementById("set-" + i).style.transform = `translateX(${this.positions[i]}vw)`;
  }

  back(i:number){
    this.positions[i] = this.positions[i] + 100;
    document.getElementById("set-" + i).style.transform = `translateX(${this.positions[i]}vw)`;
  }

  async copy(){
    const el = document.createElement('textarea');
    const uid = await this.userService.getUserId()
    el.value = `${environment.host_url}/users/${uid}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

}
