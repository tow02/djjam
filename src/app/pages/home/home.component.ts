import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service'
import { Router } from '@angular/router'
import { TrackService  } from "../../services/track.service"


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private auth:AuthenticationService, private router:Router, private trackService:TrackService) { }

  communityPlaylists:Array<any>
  staffPicks:Array<any>;
  async ngOnInit() {
    this.trackService.getStaffPicks().then(items => {
      this.staffPicks = items
      
    });
    this.trackService.getCommunityPlaylists().then(items => this.communityPlaylists = items )
   
  }

  logout(){
    this.auth.logout().then(() => this.router.navigate(['/login']));
    ;
  }

  select(item){
    this.router.navigate(['/playlist', item.id]);
  }

  selectStaffPick(item){
    this.router.navigate(['/playlist', item['Playlist ID']]);
  }



}
