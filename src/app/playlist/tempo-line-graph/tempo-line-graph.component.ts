import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'tempo-line-graph',
  templateUrl: './tempo-line-graph.component.html',
  styleUrls: ['./tempo-line-graph.component.css']
})
export class TempoLineGraphComponent implements OnInit {


  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Your Playlist' },
    { data: [28, 48, 40, 19, 86], label: 'Guideline for Newbie' },
  ];
  public lineChartLabels: Label[] = ['1', '2', '3', '4', '5', '6', '7'];
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
  constructor() { }

  chartClicked(e){
  //  console.log(e);
  }

  chartHovered(e){
   // console.log(e)
  }



  ngOnInit(): void {
  }

}
