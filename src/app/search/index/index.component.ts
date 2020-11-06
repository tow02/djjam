import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { SearchService, FilterOptions } from '../search.service'
import { Router } from '@angular/router'
import { TrackService } from '../../services/track.service'
import { ActivatedRoute } from '@angular/router'
import { ElasticSearch, ElasticTrack } from "../../models/Elastic"
import { environment } from "../../../environments/environment";
import { AuthenticationService  } from "../../services/authentication.service"
import * as queryString from 'query-string'

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
  loadFilter:FilterOptions;

  constructor(private search:SearchService, private route:ActivatedRoute, private authen:AuthenticationService, private trackService:TrackService, private location:Location, private router:Router) { 
    this.route.params.subscribe(p => {
      this.from = 0;
      this.elasticTracks = undefined;
      this.init(p['query']);
      
    })
    
  }

  async init(query:string){
    this.paramsToFilter();
    this.query = query;
    //this.searchResult = await this.search.query(this.query, this.from,);
    this.searchResult = await this.search.search(this.query, this.from, environment.search_size, this.currentFilter);
    this.elasticTracks = this.searchResult.hits.hits.map(hit => hit._source);
    console.log('init!!', this.elasticTracks)
  }

  paramsToFilter(){
    let query = this.router.url
    console.log('is parsing', query);
    let t = query.split("?");
    if(!this.loadFilter && t.length > 1){
      console.log('parse', t[1])
      let resultParse = queryString.parse(t[1], {arrayFormat: 'bracket'});

      this.loadFilter = {};
      this.isFilter = true;
      
      if(resultParse['type']){
        this.loadFilter.type = {};
        (resultParse['type'] as Array<string>).forEach(typeName => this.loadFilter.type[typeName] = typeName);
      }
        
      if(resultParse['duration[from]'])
        this.loadFilter.duration = {
          from:Number(resultParse['duration[from]']),
          to:Number(resultParse['duration[to]'])
        };
      if(resultParse['tempo[from]'])
        this.loadFilter.tempo = {
          from:Number(resultParse['tempo[from]']),
          to:Number(resultParse['tempo[to]'])
        };
      this.currentFilter = {...this.loadFilter}
    }

  }

  ngAfterContentInit(){
    console.log('after content init');
  }

    async ngOnInit(){
      
    }  

    updateFilter(filter:FilterOptions){
      //reset from
      this.from = 0;
      this.currentFilter = filter;
      delete this.elasticTracks 
      console.log('udpate filter', filter)
      this.init(this.query);
      let params:Array<string> = [];
      if(filter.type)
        params.push(Object.keys(filter.type).map(key => `type[]=${key}`).join('&'))
      if(filter.duration)
        params.push(`duration[from]=${filter.duration.from}&duration[to]=${filter.duration.to}`);
      if(filter.tempo)
        params.push(`tempo[from]=${filter.tempo.from}&tempo[to]=${filter.tempo.to}`);
      if(params.length > 0)
        this.location.replaceState(`/search/${this.query}`, params.join('&'));
      else
        this.location.replaceState(`/search/${this.query}`)
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
