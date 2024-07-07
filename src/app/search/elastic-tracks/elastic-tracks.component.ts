import {
  Component,
  Input,
  OnChanges,
  EventEmitter,
  Output,
} from '@angular/core';

import { ElasticTrack } from '../../models/Elastic';

@Component({
  selector: 'elastic-tracks',
  templateUrl: './elastic-tracks.component.html',
  styleUrls: ['./elastic-tracks.component.css'],
})
export class ElasticTracksComponent implements OnChanges {
  @Input()
  elasticTracks: Array<ElasticTrack>;
  //elasticSearch:ElasticSearch;

  currentSelectedIndex: number = -1;
  currentPlayIndex: number = -1;

  @Output()
  onPlay: EventEmitter<ElasticTrack> = new EventEmitter();

  @Output()
  onSelected: EventEmitter<ElasticTrack> = new EventEmitter();

  @Output()
  onDeselected: EventEmitter<void> = new EventEmitter();

  @Output()
  onPause: EventEmitter<void> = new EventEmitter();

  constructor() {}

  ngOnChanges(): void {
    console.log('init', this.elasticTracks);
    //this.elasticSearch.hits.hits
  }

  play(track: ElasticTrack, index: number) {
    console.log('index vs current', index, this.currentPlayIndex);
    if (index !== this.currentPlayIndex) {
      this.currentSelectedIndex = index;
      this.currentPlayIndex = index;
      console.log('emit play');
      this.onPlay.emit(track);
    } else {
      this.currentPlayIndex = -1;
      console.log('emit pause');
      this.onPause.emit();
    }
  }

  select(track: ElasticTrack, index: number) {
    //pause the unplay stuff

    console.log('select-el', index, this.currentSelectedIndex);
    if (index !== this.currentSelectedIndex) {
      console.log('select');
      this.currentSelectedIndex = index;
      this.onSelected.emit(track);
    } else {
      this.currentSelectedIndex = -1;
      console.log('deselect-el');
      this.onDeselected.emit();
    }
  }
}
