import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { SpotifyPlaylist } from "../../services/spotify.interface"
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { SpotifyService } from "../../services/spotify.service"
import { UserService, User } from "../../services/user.service"

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit, OnDestroy {


  playlistsFormGroup:FormGroup =  this.formBuilder.group({
    playlistsForm: this.formBuilder.array([], atLeastOneCheckboxCheckedValidator(1))
  });
  setFormGroup:FormGroup = this.formBuilder.group({
    set: ['', Validators.required]
  });
  playlists:Array<{playlist:SpotifyPlaylist, selected:boolean}> 
  user:User;
  sets:Array<string>
  onSelectPlaylist:EventEmitter<number> = new EventEmitter<number>();

  selectedPlaylists:Array<SpotifyPlaylist> =[]

  constructor(private spotifyService:SpotifyService, private userService:UserService, private formBuilder:FormBuilder) { }
  
  get playlistsForm(){
    return this.playlistsFormGroup.get('playlistsForm') as FormArray;
  }


  async ngOnInit() {
    this.playlists = await (await this.spotifyService.getMyWholePlaylists()).map(playlist => ({
      playlist:playlist,
      selected:false
    }));
    this.playlists.forEach(playlist => {
      this.playlistsForm.push(this.formBuilder.control(false))
    })
    this.user = await this.userService.get()
    this.sets = this.user.playlist_sets?this.user.playlist_sets:[];
    
  }

  ngOnDestroy(){
    console.log('destory')
  }

  toggle(index:number){
    this.playlists[index].selected = !this.playlistsForm.controls[index].value;
    this.playlistsForm.controls[index].setValue(this.playlists[index].selected)
    this.selectedPlaylists = this.playlists.filter(item => item.selected).map(item => item.playlist);
  }

  reset(){
    this.playlists.forEach((playlist, index) => {
      playlist.selected = false;
      this.playlistsForm.controls[index].setValue(playlist.selected)
    })
  }

  publish(){
    console.log(this.selectedPlaylists, this.setFormGroup.value.set)
  }

}

const atLeastOneCheckboxCheckedValidator = (minRequired = 1): ValidatorFn => {
  return function validate(formGroup: FormGroup) {
    let checked = 0;

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];

      if (control.value) {
        checked++;
      }
    });

    if (checked < minRequired) {
      return {
        requireCheckboxToBeChecked: true
      };
    }

    return null;
  };
}

