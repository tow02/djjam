import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpotifyService } from "../../services/spotify.service"
import { UserService } from "../../services/user.service"

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit, OnDestroy {

  constructor(private spotifyService:SpotifyService, private userService:UserService) { }

  

  ngOnInit(): void {
    console.log('init')  
  }

  ngOnDestroy(){
    console.log('destory')
  }

}
