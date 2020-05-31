import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SpotifyService, SpotifyPlaylist } from "../../services/spotify.service"
import { ChartOptions,  ChartDataSets, Chart } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  playlistId:string;
  playlist:SpotifyPlaylist;
  
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];


  constructor(private route:ActivatedRoute, private spotifyService:SpotifyService) { 
    this.route.params.subscribe(p => {
      this.playlistId = p['id']      
      if(this.spotifyService.isConnect()){
        this.spotifyService.getPlaylist(this.playlistId).then(playlists =>{
           this.playlist = playlists
           if(this.playlist){
          }
          
          
      });

      }
        
      

    })
  }

  async ngOnInit() {
    console.log('hi', this.playlist)
    
    
    
  }

}
