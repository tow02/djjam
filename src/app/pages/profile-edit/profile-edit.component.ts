import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';
import { Playlist } from '../../models/Track';

interface ProfilePlaylistSet {
  name: string;
  playlists: Array<Playlist>;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent implements OnInit {
  @ViewChild('main')
  mainContainer: ElementRef;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authen: AuthenticationService,
  ) {
    this.route.params.subscribe((params) => {
      if (params['uid']) this.uid = params.uid;
    });
    this.authen.auth.authState.subscribe((u) => {
      if (u) this.isLogin = true;
      else this.isLogin = false;
    });
  }

  SET_VIEW_LIMIT = 6;
  sets: Array<ProfilePlaylistSet> = [];
  positions: Array<number> = [];
  isMoveAnimation: Array<boolean> = [];
  isLogin = false;
  uid: string;
  user: User;
  async ngOnInit() {
    if (!this.uid) {
      this.user = await this.userService.get();
      this.uid = await this.userService.getUserId();
    } else {
      this.user = await this.userService.get(this.uid);
    }

    console.log(this.user);
    if (this.user.playlist_sets) {
      //filter(setName => this.user.playlist_set_map && this.user.playlist_set_map[this.userService.nameToSlug(setName)] )
      console.log('this.user.playlist_sets', this.user.playlist_sets);
      this.sets = this.user.playlist_sets.map((setName) => {
        if (this.user.playlist_set_map[this.userService.nameToSlug(setName)])
          return {
            name: setName,
            playlists:
              this.user.playlist_set_map[this.userService.nameToSlug(setName)],
          } as ProfilePlaylistSet;
        else
          return {
            name: setName,
            playlists: [],
          } as ProfilePlaylistSet;
      });
      this.positions = new Array(this.sets.length).fill(0);
      this.isMoveAnimation = new Array(this.sets.length).fill(false);
      console.log(this.sets);
    }
  }

  select(playlist: Playlist) {
    if (this.isLogin) this.router.navigate(['/playlist', playlist.id]);
    else
      window.location.href = `https://open.spotify.com/playlist/${playlist.id}`;
  }

  _move(setIndex: number, target: number) {
    const origin = { ...this.sets[setIndex] };
    this.sets[setIndex] = this.sets[target];
    this.sets[target] = origin;
    this.user.playlist_sets = this.sets.map((item) => item.name);
    this.userService.update(this.user, ['playlist_sets']);
  }

  moveUp(setIndex: number) {
    const target =
      setIndex - 1 >= 0 ? setIndex - 1 : setIndex - 1 + this.sets.length;

    this._move(setIndex, target);
  }

  moveDown(setIndex: number) {
    const target = (setIndex + 1) % this.sets.length;
    this._move(setIndex, target);
  }

  edit(setIndex: number) {
    console.log(
      this.sets[setIndex],
      this.userService.nameToSlug(this.sets[setIndex].name),
    );
    this.router.navigate([
      '/profile/edit',
      this.userService.nameToSlug(this.sets[setIndex].name),
    ]);
  }

  /*_move(setIndex:number, positionIndex:number, target:number){
    const origin = {...this.sets[setIndex].playlists[positionIndex]}
    this.sets[setIndex].playlists[positionIndex ] = this.sets[setIndex].playlists[target]
    this.sets[setIndex].playlists[target] = origin;
    this.isMoveAnimation = new Array(this.sets.length).fill(false);
    this.isMoveAnimation[target] = true;
  }*/

  async copy() {
    const el = document.createElement('textarea');
    const uid = await this.userService.getUserId();
    el.value = `${environment.host_url}/users/${uid}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
