import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrackElement } from '../tracks-controller/tracks-controller.component';
import { TrackService } from '../../services/track.service';
import { ThemeService } from 'ng2-charts';

@Component({
  selector: 'app-dialog-track',
  templateUrl: './dialog-track.component.html',
  styleUrls: ['./dialog-track.component.css'],
})
export class DialogTrackComponent implements OnInit {
  tags: Array<string> = [];
  personal_tags: Array<string> = [];
  canEditBpm = false;
  newTag: string;
  constructor(
    private trackService: TrackService,
    public dialogRef: MatDialogRef<DialogTrackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrackElement,
  ) {
    this.tags = data.tags.split(',');
    if (data.personal_tags) this.personal_tags = data.personal_tags.split(',');
    else this.personal_tags = [];
    this.canEditBpm = this.tags.findIndex((item) => item == 'uncheck') != -1;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async update() {
    this.trackService.updateBpm(this.data.spotifyItem.track.id, this.data.bpm);
    this.dialogRef.close();
  }

  addNewTag() {
    this.trackService.updatePersonaltags(this.data.spotifyItem.track.id, [
      this.newTag,
    ]);
  }

  ngOnInit(): void {}
}
