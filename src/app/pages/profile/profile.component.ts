import { Component, OnInit } from '@angular/core';

interface ProfilePlaylist{
    name:string,
    url:string,
    id:string
}

interface ProfilePlaylistSet{
  name:string
  playlists:Array<ProfilePlaylist>
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  sets:Array<ProfilePlaylistSet> = []

  ngOnInit(): void {
  }

}
