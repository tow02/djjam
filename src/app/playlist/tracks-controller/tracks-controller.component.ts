import { Component, OnChanges, Input } from '@angular/core';
import { PlaylistEvent } from "../playlist.event.interface"
import { SpotifyService } from "../../services/spotify.service"
import { MatDialog } from '@angular/material/dialog';
import { TrackService } from "../../services/track.service"
import { DialogTrackComponent } from "../dialog-track/dialog-track.component"
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { SpotifyTrackItem } from 'src/app/services/spotify.interface';

export interface TrackElement{
  name:string,
  artists:string,
  bpm:number,
  tags:string
  spotifyItem:SpotifyTrackItem
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
  displayedColumns: string[] = ['play','name', 'artists', 'bpm','actions'];
  dataSource :MatTableDataSource<TrackElement>

  constructor(private spotifyService:SpotifyService, private dialog:MatDialog, private trackService:TrackService) { }

  ngOnChanges(): void {
    if(this.playlistEvent.status === "done"){
      console.log('tracks', this.playlistEvent.playlist.tracks)
      this.trackSource =this.playlistEvent.playlist.tracks.items.filter(item => !item.is_local).map(item => {
        
          const trackElement:TrackElement = {
            name:item.track.name,
            artists:item.track.artists.map(a => a.name).join(','),
            bpm:0,
            tags:'',
            spotifyItem:item
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

  toggleTrack(track:TrackElement){
    
    this.trackService.play(track.spotifyItem.track.id);
  }

  openTrack(track:TrackElement){
    this.dialog.open(DialogTrackComponent,{
      data:track
    })
  }

}
