import { Component, Input, OnChanges } from '@angular/core';

import { ElasticTrack } from "../../models/Elastic"


@Component({
  selector: 'elastic-tracks',
  templateUrl: './elastic-tracks.component.html',
  styleUrls: ['./elastic-tracks.component.css']
})
export class ElasticTracksComponent implements OnChanges {

  @Input()
  elasticTracks:Array<ElasticTrack>
  //elasticSearch:ElasticSearch;


  constructor() { }

  ngOnChanges(): void {
    console.log('init', this.elasticTracks)
    //this.elasticSearch.hits.hits
  }

}
