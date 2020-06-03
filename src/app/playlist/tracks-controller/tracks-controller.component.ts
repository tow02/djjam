import { Component, OnChanges, Input } from '@angular/core';
import { PlaylistEvent } from "../playlist.event.interface"
import { SpotifyService } from "../../services/spotify.service"
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

interface TrackElement{
  name:string,
  artists:string,
  bpm:number,
  tags:string
}

@Component({
  selector: 'tracks-controller',
  templateUrl: './tracks-controller.component.html',
  styleUrls: ['./tracks-controller.component.css']
})
export class TracksControllerComponent implements OnChanges {


  @Input()
  playlistEvent:PlaylistEvent

  trackSource:Array<TrackElement> = [];
  displayedColumns: string[] = ['name', 'artists', 'bpm'];
  dataSource :MatTableDataSource<TrackElement>

  constructor(private spotifyService:SpotifyService) { }

  ngOnChanges(): void {
    if(this.playlistEvent.status === "done"){
      console.log('tracks', this.playlistEvent.playlist.tracks)
      this.trackSource =this.playlistEvent.playlist.tracks.items.filter(item => !item.is_local).map(item => {
          const trackElement:TrackElement = {
            name:item.track.name,
            artists:item.track.artists.map(a => a.name).join(','),
            bpm:0,
            tags:''
          };

          //update bpm;
          trackElement.bpm = this.spotifyService._processSpotifyTrackToBpm(item, this.playlistEvent.djjamTracks, this.playlistEvent.audioFeatures);
          trackElement.tags = this.spotifyService._processTagsToArrayTags(this.spotifyService._processSpotifyTrackToTags(item,  this.playlistEvent.djjamTracks, this.playlistEvent.audioFeatures)).join(',');
          return trackElement;
      })
      this.dataSource = new MatTableDataSource(this.trackSource);
      console.log(this.trackSource)
    }
      
  }

}
