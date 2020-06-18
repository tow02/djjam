import { Component, OnInit } from '@angular/core';
import { UserService, User } from "../../services/user.service"
import  {ActivatedRoute } from "@angular/router"
import { CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop'

import { Playlist } from 'src/app/models/Track';

@Component({
  selector: 'app-profile-edit-set',
  templateUrl: './profile-edit-set.component.html',
  styleUrls: ['./profile-edit-set.component.css']
})
export class ProfileEditSetComponent implements OnInit {

  user:User;
  setName:string;
  setActualName:string;
  playlists:Array<Playlist>

  

  constructor(private userService:UserService, private route:ActivatedRoute) { 
    this.route.params.subscribe(p => {
      this.setName = p['slug'];
    })
  }

  async ngOnInit() {
    this.user = await  this.userService.get();
    
    this.setActualName = this.user.playlist_sets.find(name => this.userService.nameToSlug(name) == this.setName)
    //console.log('playlists', this.user.playlist_set_map[this.setName]);
    this.playlists = this.user.playlist_set_map[this.setName];
    
  }

  drop(event: CdkDragDrop<Playlist[]>) {
    
    console.log('move', this.user)
    this.userService.update(this.user, ['playlist_set_map'])
    moveItemInArray(this.playlists, event.previousIndex, event.currentIndex);
  }

  moveup(index:number){
    let newIndex = index -1 >=0?index-1:this.playlists.length-1;
    moveItemInArray(this.playlists, index, newIndex);
    console.log('move', this.user)
    this.userService.update(this.user, ['playlist_set_map'])
  }

  movedown(index:number){
    let newIndex = index + 1 < this.playlists.length?index + 1:0
    moveItemInArray(this.playlists, index, newIndex);
    console.log('move', this.user)
    this.userService.update(this.user, ['playlist_set_map'])
  }

  remove(index:number){
    this.playlists.splice(index, 1);
    this.userService.update(this.user, ['playlist_set_map'])
  }

}
