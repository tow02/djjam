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
    { data: [2,5,15,5,1], label: 'Your Tempo',  backgroundColor:'#ffc218' },
    { data: [0,8,17,1,0], label: 'Guideline for Newbie',  backgroundColor:'rgb(32, 215, 94)' },
  ];
  constructor() { }

  ngOnInit(): void {
    
  }

}
