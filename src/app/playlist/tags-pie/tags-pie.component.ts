import { Component, OnChanges, Input } from '@angular/core';
import { ChartType, RadialChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { PlaylistEvent } from '../playlist.event.interface';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'tags-pie',
  templateUrl: './tags-pie.component.html',
  styleUrls: ['./tags-pie.component.css'],
})
export class TagsPieComponent implements OnChanges {
  @Input()
  playlistEvent: PlaylistEvent;

  public radarChartOptions: RadialChartOptions = {
    responsive: true,
  };

  public radarChartLabels: Label[];

  public radarChartData: ChartDataSets[]; /*= [
    //{ data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
  ];*/
  public radarChartType: ChartType = 'radar';

  constructor(private spotifyService: SpotifyService) {}

  ngOnChanges(): void {
    if (this.playlistEvent.status == 'done') {
      console.log(
        'after with dj Jam',
        this.spotifyService.getTrackTags(
          this.playlistEvent.playlist,
          this.playlistEvent.audioFeatures,
          this.playlistEvent.djjamTracks,
        ),
      );
      let result = this.spotifyService.getTrackTags(
        this.playlistEvent.playlist,
        this.playlistEvent.audioFeatures,
        this.playlistEvent.djjamTracks,
      );
      this.radarChartData = [
        {
          data: Object.keys(result).map((tagName) => result[tagName].length),
          label: 'Tags',
        },
      ];
      this.radarChartLabels = Object.keys(result);
    }
  }
}
