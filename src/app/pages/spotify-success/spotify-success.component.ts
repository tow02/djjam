import { Component, OnInit } from '@angular/core';
import { SpotifyService } from "../../services/spotify.service"
import { Router } from "@angular/router"

@Component({
  selector: 'app-spotify-success',
  templateUrl: './spotify-success.component.html',
  styleUrls: ['./spotify-success.component.css']
})
export class SpotifySuccessComponent implements OnInit {

  constructor(private router:Router, private spotifyService:SpotifyService) { }

  ngOnInit(): void {
    console.log(this.router.url);
    this.spotifyService.processSignin(this.router.url);
    

    //  console.log(params);
    

  }

}
