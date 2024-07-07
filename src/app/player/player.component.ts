import { Component, OnInit } from '@angular/core';
import { TrackService, TrackEvent } from '../services/track.service';
import { SpotifyService } from '../services/spotify.service';
import APlayer from 'aplayer';
import { Track } from '../models/Track';
import { SpotifyTrackItem } from '../services/spotify.interface';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  ap;
  isActive = false;
  isPlaying = false;
  isSpotifyActive = false;
  isSpotifyPlaying = false;
  currentSpotifyTrack: Track | any;
  currentTrackEvent: TrackEvent;
  currentPlayingId: string;
  playlistItems: Array<{ name: string; id: string }>;
  playlistGroupByCharacters: Array<{ name: string; id: string }>;
  playlistGroupMap: { [key: string]: Array<{ name: string; id: string }> } = {};

  constructor(
    private trackService: TrackService,
    private spotifyService: SpotifyService,
  ) {}

  playPreviewTrack(e: TrackEvent) {
    if (this.isSpotifyPlaying) this.spotifyService.pauseTrack();
    this.isActive = true;
    let track = e.track;

    if (e.action == 'play' || e.action == 'select')
      if (this.isPlaying) {
        this.ap.pause();
      }

    if (e.action == 'play') {
      this.ap = new APlayer({
        container: document.getElementById('aplayer'),
        audio: [
          {
            name: track.name,
            artist: track.artists.map((a) => a.name).join(', '),
            url: track.preview_url,
            cover: track.album.images[0].url,
            id: track.id,
          },
        ],
        loop: 'none',
      });
      if (this.currentPlayingId != e.track.id) {
        this.ap.skipForward();
      }
      console.log('attemp to play');
      this.ap.play();
      this.isPlaying = true;
      this.currentPlayingId = e.track.id;
    }

    if (e.action == 'pause') {
      this.ap.pause();
      this.isPlaying = false;
    }
    if (e.action == 'deselect') this.isActive = false;
  }

  playSpotifyTrack(e: TrackEvent) {
    if (this.isPlaying) {
      this.isActive = false;
      this.ap.pause();
      this.isPlaying = false;
    }
    if (e.action == 'play' || e.action == 'select') {
      this.isSpotifyActive = true;

      this.currentSpotifyTrack = e.track ? e.track : e.spotifyTrack.track;
      console.log(this.currentSpotifyTrack);
    } else {
      this.isSpotifyActive = false;
    }
    if (e.action == 'play') {
      this.isSpotifyPlaying = true;
      this.spotifyService.playTrack(e.spotifyTrack.track.id);
    } else if (e.action == 'pause' || e.action == 'deselect') {
      this.isSpotifyPlaying = false;
      this.spotifyService.pauseTrack();
    }
  }

  initPlaylistGroup() {
    this.playlistGroupByCharacters = [];
    //a - z
    const groupCharacters = [
      ['a', 'b', 'c', 'd'],
      ['e', 'f', 'g', 'h', 'i'],
      ['j', 'k', 'l', 'm'],
      ['n', 'o', 'p', 'q'],
      ['r', 's', 't', 'u'],
      ['v', 'w', 'x', 'y', 'z'],
    ];
    groupCharacters.forEach((characters) => {
      let result = this.playlistItems.filter(
        (item) =>
          characters.filter(
            (char) => item.name.toLocaleLowerCase().substr(0, 1) == char,
          ).length > 0,
      );
      //  console.log(characters, result)
      if (result.length > 0) {
        let id = `${characters[0]}${characters[characters.length - 1]}`;
        result.sort((a, b) => {
          if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase())
            return -1;
          else return 1;
        });
        this.playlistGroupByCharacters.push({
          id: id,
          name: `${characters[0].toLocaleUpperCase()} - ${characters[characters.length - 1].toLocaleUpperCase()}`,
        });

        this.playlistGroupMap[id] = result;
      }
    });
  }

  addTrackPlaylist(playlistId: string) {
    let trackId: string = this.currentTrackEvent.spotifyTrack
      ? this.currentTrackEvent.spotifyTrack.track.id
      : this.currentTrackEvent.track.id;
    this.spotifyService.addTrackToPlaylist(trackId, playlistId);
  }

  ngOnInit(): void {
    console.log('initTrackPlayer');
    this.ap = new APlayer({
      container: document.getElementById('aplayer'),
      loop: 'none',
    });

    this.trackService.onChangeTrack.subscribe((e: TrackEvent) => {
      //found a new track
      this.currentTrackEvent = e;
      console.log('play new track?', e);

      if (e.track && e.track.preview_url) this.playPreviewTrack(e);
      else this.playSpotifyTrack(e);
    });

    this.spotifyService.onAuthChange.subscribe((event) => {
      console.log('auth change', event);
      if (event.signin == 'signin') {
        console.log('try to get id');
        this.spotifyService
          .getMyWholePlaylists()
          .then((result) => {
            this.playlistItems = result.map((item) => ({
              name: item.name,
              id: item.id,
            }));
            this.initPlaylistGroup();

            console.log('add to ', this.playlistItems);
          })
          .catch((err) => {
            console.log('sign in error to get playlist', err);
          });
      }
    });
    this.spotifyService.getMyWholePlaylists().then((result) => {
      this.playlistItems = result.map((item) => ({
        name: item.name,
        id: item.id,
      }));
      this.initPlaylistGroup();

      console.log('add to ', this.playlistItems);
    });
  }
}
