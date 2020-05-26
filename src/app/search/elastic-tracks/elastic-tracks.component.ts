import { Component, Input, OnChanges, EventEmitter, Output } from '@angular/core';

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

  @Output()
  onPlay:EventEmitter<ElasticTrack> = new EventEmitter();

  @Output()
  onSelected:EventEmitter<ElasticTrack> = new EventEmitter();


  constructor() { }

  ngOnChanges(): void {
    console.log('init', this.elasticTracks)
    //this.elasticSearch.hits.hits
  }

  play(track:ElasticTrack){
    this.onPlay.emit(track);
  }

  select(track:ElasticTrack){
    this.onSelected.emit(track);
  }

}
