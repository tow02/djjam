import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistRoutingModule } from './playlist-routing.module';
import { ViewComponent } from './view/view.component';
import { ChartsModule } from 'ng2-charts';
import { TempoGraphComponent } from './tempo-graph/tempo-graph.component';
import { TempoLineGraphComponent } from './tempo-line-graph/tempo-line-graph.component';


@NgModule({
  declarations: [ViewComponent, TempoGraphComponent, TempoLineGraphComponent],
  imports: [
    CommonModule,
    ChartsModule,
    PlaylistRoutingModule
  ]
})
export class PlaylistModule { }
