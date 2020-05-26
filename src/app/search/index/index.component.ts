import { Component, OnInit, HostListener } from '@angular/core';
import { SearchService } from '../search.service'
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
export class IndexComponent implements OnInit {

  searchResult:ElasticSearch;
  elasticTracks:Array<ElasticTrack>;
  isSubLoading = false;
  
  from = 0;
  query:string;

  constructor(private search:SearchService, private route:ActivatedRoute, private authen:AuthenticationService, private trackService:TrackService) { 
    this.route.params.subscribe(p => {
      this.query = p['query'];
    })
  }

   async ngOnInit() {
     let result = await this.authen.login("sompop@djjam.org", "sompopcool");
     console.log('login result', result);
     
    /*this.search.queryTrack("(artists:count%20OR%20name:count%20OR%20tags:count%20OR%20(personal_tags:count^100%20AND%20personal_tags:29Nw9XgdbbWedz2ZTt13a2Zsgy42%20))%20AND%20(artists:basie%20OR%20name:basie%20OR%20tags:basie%20OR%20(personal_tags:basie^100%20AND%20personal_tags:29Nw9XgdbbWedz2ZTt13a2Zsgy42%20))")
    .subscribe(e => {
      this.searchResult = e;
      console.log('e', e);
    })*/
    //
    this.searchResult = await this.search.query(this.query, this.from);
    this.elasticTracks = this.searchResult.hits.hits.map(hit => hit._source);
    console.log(this.searchResult);
  }

  async loadMore(){
    this.isSubLoading = true;
    this.from += environment.search_size;
    this.searchResult = await this.search.query(this.query, this.from);
    this.elasticTracks = this.elasticTracks.concat( this.searchResult.hits.hits.map(hit => hit._source) );
    this.isSubLoading = false;
    console.log("done loading");
  }

  play(e:ElasticTrack){
    console.log('play', e);
    this.trackService.play(e.id);
  }

  select(e:ElasticTrack){
    console.log('select', e);
    this.trackService.select(e.id);
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
