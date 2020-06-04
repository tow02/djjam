import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserService } from "../../services/user.service"

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {


  profileForm  =  this.formBuilder.group({
    djName:['', Validators.required],
    communityName: [''],
    cityName: [''],
    imageUrl: [''],
    playlistSets: this.formBuilder.array([
      this.formBuilder.control('Recent Playlists', Validators.required),
      this.formBuilder.control('Social Dancing', Validators.required),
    ])
  })

  get playlistSets(){
    return this.profileForm.get('playlistSets') as FormArray;
  }

  constructor(private userService:UserService, private formBuilder:FormBuilder) {
     
   }

  async ngOnInit(){
    let info = await this.userService.get()
    console.log(info);
  }

  addPlaylistSet(){
    this.playlistSets.push(this.formBuilder.control('', Validators.required));
  }

  removePlaySet(index:number){
    this.playlistSets.removeAt(index);
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
  }

}
