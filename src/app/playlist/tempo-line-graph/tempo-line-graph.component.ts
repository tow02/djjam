import { Component, OnChanges, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { PlaylistEvent } from "../playlist.event.interface"
import { SpotifyService } from "../../services/spotify.service"
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'tempo-line-graph',
  templateUrl: './tempo-line-graph.component.html',
  styleUrls: ['./tempo-line-graph.component.css']
})
export class TempoLineGraphComponent implements OnChanges {

  @Input()
  playlistEvent:PlaylistEvent;

  public lineChartData: ChartDataSets[] = [
    
  ];
  currentIndex = -1;
  customToolTips:string;
  public lineChartLabels: Label[] 
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
  
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        }
      ]
    },
    tooltips:{
      custom:(model)=> {
        
        
        if(model.body && model.body.length > 0 && model.body[0].lines && model.body[0].lines.length > 0){
          model.body[0].lines[0] = this.customToolTips;
        }
          
      }
    },
    annotation: {
      annotations: [ ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: '#ffc21894',
      pointBackgroundColor: '#ffc218',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgb(32, 215, 94,0.7)',
      pointBackgroundColor: 'rgb(32, 215, 94)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  bpms:Array<number>
  constructor(private spotifyService:SpotifyService) { }

  chartClicked(e){
    console.log(e);
  }

  chartHovered(e){
    
    if(e.active && e.active.length >0)
      this.customToolTips = this.playlistEvent.playlist.tracks.items[e.active[0]._index].track.name + ` (${this.spotifyService._processSpotifyTrackToBpm(this.playlistEvent.playlist.tracks.items[e.active[0]._index], this.playlistEvent.djjamTracks, this.playlistEvent.audioFeatures)})`
      
  }



  ngOnChanges(): void {
    if(this.playlistEvent.status === "done")
      {
        this.bpms = this.spotifyService.getTrackBpms(this.playlistEvent.playlist, this.playlistEvent.djjamTracks, this.playlistEvent.audioFeatures)
        this.lineChartData = [
          { data: this.bpms, label: this.playlistEvent.playlist.name },
        ]
        this.lineChartLabels =this.bpms.map((item, index) => index + 1 +'');
      }
  }

}
