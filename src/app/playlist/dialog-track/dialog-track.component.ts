import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TrackElement } from "../tracks-controller/tracks-controller.component"
import { TrackService } from "../../services/track.service"

@Component({
  selector: 'app-dialog-track',
  templateUrl: './dialog-track.component.html',
  styleUrls: ['./dialog-track.component.css']
})
export class DialogTrackComponent implements OnInit {

  tags:Array<string>=[];
  canEditBpm = false;
  constructor(
    private trackService:TrackService,
    public dialogRef: MatDialogRef<DialogTrackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrackElement) {
      this.tags = data.tags.split(',')
      this.canEditBpm = this.tags.findIndex(item => item == "uncheck") != -1
      
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async update(){
    this.trackService.updateBpm(this.data.spotifyItem.track.id, this.data.bpm);
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
