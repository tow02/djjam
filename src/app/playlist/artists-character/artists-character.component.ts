import { Component, OnChanges, Input } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { PlaylistEvent } from '../playlist.event.interface';
import { SpotifyArtist } from 'src/app/services/spotify.interface';

@Component({
  selector: 'artists-character',
  templateUrl: './artists-character.component.html',
  styleUrls: ['./artists-character.component.css'],
})
export class ArtistsCharacterComponent implements OnChanges {
  @Input()
  playlistEvent: PlaylistEvent;

  artistInfomation: {
    [key: string]: {
      name: string;
      id: string;
      count: number;
    };
  };

  artists: Array<SpotifyArtist>;

  constructor(private spotifyService: SpotifyService) {}

  async ngOnChanges() {
    if (this.playlistEvent.status == 'done') {
      this.artistInfomation = this.spotifyService.getArtistsInfomation(
        this.playlistEvent.playlist,
      );
      const ids = Object.keys(this.artistInfomation)
        .map((item) => ({ id: item, count: this.artistInfomation[item].count }))
        .sort((a, b) => {
          if (a.count > b.count) return -1;
          else return 1;
        })
        .map((item) => item.id);

      this.artists = await this.spotifyService.getArtists(ids);
      console.log('artists', this.artists);
    }
  }
}
