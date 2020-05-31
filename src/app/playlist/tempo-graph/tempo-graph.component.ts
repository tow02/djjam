import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { environment } from "../../../environments/environment"
import { Label } from 'ng2-charts';

@Component({
  selector: 'tempo-graph',
  templateUrl: './tempo-graph.component.html',
  styleUrls: ['./tempo-graph.component.css']
})
export class TempoGraphComponent implements OnInit {

  
  public barChartLabels: Label[] = environment.analytics.rangeNames.map(item => `${item.name} (${item.bpmMin} - ${item.bpmMax})`);
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  
  public barChartData: ChartDataSets[] = [
    { data: [2,5,15,5,1], label: 'Playlist Tempo',  backgroundColor:'#ffc218' },
  ];
  constructor() { }

  ngOnInit(): void {
    
  }

}
