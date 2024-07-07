import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit {
  constructor(private spotifyService: SpotifyService) {}

  isConnect = false;
  playlists = [];

  @Output()
  onClickSideMenu: EventEmitter<void> = new EventEmitter<void>();

  async ngOnInit() {
    this.spotifyService.onAuthChange.subscribe((obj) => {
      console.log('obj', obj, this.spotifyService.isConnect());
      if (!this.isConnect && this.spotifyService.isConnect()) {
        console.log('stuff');
        this.isConnect = this.spotifyService.isConnect();
        this.playlists = [];
        this.spotifyService.getMyWholePlaylists((playlists) => {
          this.playlists = playlists;
          //console.log(this.playlists)
        });
      }
    });
    this.isConnect = this.spotifyService.isConnect();
    console.log('is connect', this.isConnect);
    if (this.isConnect)
      this.spotifyService.getMyWholePlaylists((playlists) => {
        this.playlists = playlists;
        //console.log(this.playlists)
      });
    //console.log(playlists)
  }

  spotifyConnnect() {
    this.spotifyService.authen(true);
  }

  navigate() {
    if (this.onClickSideMenu) this.onClickSideMenu.emit();
  }
}
