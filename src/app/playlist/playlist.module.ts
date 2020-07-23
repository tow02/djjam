import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table'
import { PlaylistRoutingModule } from './playlist-routing.module';
import { UserService } from "../services/user.service"
import { TrackService } from "../services/track.service"
import { MatIconModule} from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ViewComponent } from './view/view.component';
import { ChartsModule } from 'ng2-charts';
import { TempoGraphComponent } from './tempo-graph/tempo-graph.component';
import { TempoLineGraphComponent } from './tempo-line-graph/tempo-line-graph.component';
import { TagsPieComponent } from './tags-pie/tags-pie.component';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ArtistsCharacterComponent } from './artists-character/artists-character.component';
import { TracksControllerComponent } from './tracks-controller/tracks-controller.component';
import { DialogTrackComponent } from './dialog-track/dialog-track.component';


@NgModule({
  declarations: [ViewComponent, TempoGraphComponent, TempoLineGraphComponent, TagsPieComponent, ArtistsCharacterComponent, TracksControllerComponent, DialogTrackComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatMenuModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    ChartsModule,
    PlaylistRoutingModule
  ],
  providers:[UserService, TrackService]
})
export class PlaylistModule { }
