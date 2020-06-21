import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { SearchService } from "./search.service"
import { SearchRoutingModule } from './search-routing.module';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { IndexComponent } from './index/index.component';
import { ElasticTracksComponent } from './elastic-tracks/elastic-tracks.component';
import {MatButtonModule} from '@angular/material/button'
import {MatListModule} from '@angular/material/list'
import {MatIconModule} from '@angular/material/icon'
import { SecsToTimePipe } from "../pipes/secstotime.pipe"

import { TrackService } from '../services/track.service'
import { AuthenticationService } from "../services/authentication.service";
import { SearchFilterComponent } from './search-filter/search-filter.component'

@NgModule({
  declarations: [SearchboxComponent, IndexComponent, ElasticTracksComponent, SecsToTimePipe, SearchFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    SearchRoutingModule
  ],
  exports:[SearchboxComponent],
  providers:[SearchService, AuthenticationService, TrackService]
})
export class SearchModule { }
