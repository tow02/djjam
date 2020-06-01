import { Component, OnChanges, Input } from '@angular/core';
import { PlaylistEvent } from "../playlist.event.interface"
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
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
    { data: [2,5,15,5,1], label: 'Your Tempo',  backgroundColor:'#ffc218' },
    /*{ data: [0,8,17,1,0], label: 'Guideline for Newbie',  backgroundColor:'rgb(32, 215, 94)' },*/
  ];
  constructor() { }

  bpmTracks:Array<number>;

  getBpmRanges(){
    this.bpmTracks =  this.playlistEvent.playlist.tracks.items.filter(item => !item.is_local).map(item => {  
        if(this.playlistEvent.djjamTracks[item.track.id])
          return this.playlistEvent.djjamTracks[item.track.id].bpm
        else
          return this.playlistEvent.audioFeatures[item.track.id].tempo < 100?this.playlistEvent.audioFeatures[item.track.id].tempo *2:this.playlistEvent.audioFeatures[item.track.id].tempo ;
      
    })
    
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

  }

  ngOnChanges(): void {

    console.log('change', this.playlistEvent)
    if(this.playlistEvent.status == "done"){
      this.barChartData = [
        { data: this.getBpmRanges(), label: 'Your Tempo',  backgroundColor:'#ffc218' },
      ]
    }
      
  }

}
