import { Component, HostListener, OnInit } from '@angular/core';
import { SearchService, FilterOptions } from '../search.service'
import { TrackService } from '../../services/track.service'
import { ActivatedRoute } from '@angular/router'
import { ElasticSearch, ElasticTrack } from "../../models/Elastic"
import { environment } from "../../../environments/environment";
import { AuthenticationService  } from "../../services/authentication.service"

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements  OnInit {

  searchResult:ElasticSearch;
  elasticTracks:Array<ElasticTrack>;
  isSubLoading = false;
  isFilter = false;
  from = 0;
  query:string;
  currentFilter:FilterOptions = {};

  constructor(private search:SearchService, private route:ActivatedRoute, private authen:AuthenticationService, private trackService:TrackService) { 
    this.route.params.subscribe(p => {
      
      console.log('change in query?')
      this.init(p['query']);
    })
    
  }

  async init(query:string){

    this.query = query
    //this.searchResult = await this.search.query(this.query, this.from,);
    this.searchResult = await this.search.search(this.query, this.from, environment.search_size, this.currentFilter);
    this.elasticTracks = this.searchResult.hits.hits.map(hit => hit._source);
    console.log('init!!', this.elasticTracks)
  }

  ngAfterContentInit(){
    console.log('after content init');
  }

    async ngOnInit(){
    
    }  

    updateFilter(filter:FilterOptions){
      this.currentFilter = filter;
      this.elasticTracks = [];
      console.log('udpate filter', filter)
      this.init(this.query);
    }

  async loadMore(){
    this.isSubLoading = true;
    this.from += environment.search_size;
    
    //this.searchResult = await this.search.query(this.query, this.from);
    this.searchResult = await  this.search.search(this.query, this.from, environment.search_size, this.currentFilter);
    this.elasticTracks = this.elasticTracks.concat( this.searchResult.hits.hits.map(hit => hit._source) );
    this.isSubLoading = false;
    console.log("done loading");
  }

  play(e:ElasticTrack){
    console.log('play', e);
    this.trackService.play(e.id);
  }

  select(e:ElasticTrack){
    console.log('index-select', e);
    this.trackService.select(e.id);
  }

  deSelect(){
    console.log('---deSelect')
    this.trackService.deSelect();
  }

  pause(){
    this.trackService.pause();
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {

    let pos = (document.documentElement.scrollTop || document.body.scrollTop);
    let screenHeight = window.screen.height
    //console.log(pos, document.documentElement.offsetHeight, screenHeight, (pos + document.documentElement.offsetHeight), pos + screenHeight >= document.documentElement.offsetHeight)
    //if(pos + 100 >= document.documentElement.offsetHeight && !this.isSubLoading){
    if(this.searchResult && pos + screenHeight >= document.documentElement.offsetHeight && !this.isSubLoading && this.searchResult.hits.total > this.elasticTracks.length )   {
      console.log('load more')
      this.loadMore();
    //Do your action here
      //if(!this.isAllLoading)
        //this.loadNextTracksPart();
      //else
       // console.log('SKIP DOUBLE LOADING')
    }

     
  }

}
