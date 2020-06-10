import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service"
import { SpotifyService } from "../../services/spotify.service"
import { Router } from "@angular/router"

@Component({
  selector: 'app-spotify-login',
  templateUrl: './spotify-login.component.html',
  styleUrls: ['./spotify-login.component.css']
})
export class SpotifyLoginComponent implements OnInit {

  constructor(private router:Router, private authen:AuthenticationService, private spotifyService:SpotifyService) { }

  async ngOnInit() {
    const result = this.spotifyService.parseUrl(this.router.url)
    const spotifyUser:{status:string, token:string} = await this.authen.authenWithSpotify(result.access_token).then(result => {
      return result.json()
    }).catch(e => {
      console.log('e', e)
    });
    await this.authen.auth.signInWithCustomToken(spotifyUser.token)
    this.spotifyService.processSignin(this.router.url);
    this.router.navigate(['/']);
    
  }

}
