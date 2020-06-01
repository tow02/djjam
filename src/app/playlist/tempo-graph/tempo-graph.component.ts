import { Component, OnChanges, Input } from '@angular/core';
import { PlaylistEvent } from "../playlist.event.interface"
import { SpotifyService } from "../../services/spotify.service"
import {  ChartType, ChartDataSets } from 'chart.js';
import { environment } from "../../../environments/environment"
import { Label } from 'ng2-charts';

@Component({
  selector: 'tempo-graph',
  templateUrl: './tempo-graph.component.html',
  styleUrls: ['./tempo-graph.component.css']
})
export class TempoGraphComponent implements OnChanges {


  @Input()
  playlistEvent:PlaylistEvent 
  
  public barChartLabels: Label[] = environment.analytics.rangeNames.map(item => `${item.name} (${item.bpmMin} - ${item.bpmMax})`);
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  
  public barChartData: ChartDataSets[] = [
    
    /*{ data: [0,8,17,1,0], label: 'Guideline for Newbie',  backgroundColor:'rgb(32, 215, 94)' },*/
  ];
  constructor(private spotifyService:SpotifyService) { }

  bpmTracks:Array<number>;

  getBpmRanges(){
    this.bpmTracks =  this.spotifyService.getTrackBpms(this.playlistEvent.playlist, this.playlistEvent.djjamTracks, this.playlistEvent.audioFeatures)
    const trackCount = this.bpmTracks.length;
    //get bpm range
    return this.bpmTracks.reduce((prev, current) => {
      let plus = environment.analytics.rangeNames.map(item => {
        if( current >= item.bpmMin && current < item.bpmMax)
          return 1;
        else
          return 0;
      })
      return plus.map((amount, index) => amount + prev[index]);
    }, environment.analytics.rangeNames.map(item => 0))
    .map(num => Math.round(num/trackCount * 100 ))

  }

  ngOnChanges(): void {

    console.log('change', this.playlistEvent)
    if(this.playlistEvent.status == "done"){
      console.log(this.getBpmRanges())
      this.barChartData = [
        { data: this.getBpmRanges(), label: `${this.playlistEvent.playlist.name} % `,  backgroundColor:'#ffc218' },
      ]
    }
      
  }

}
