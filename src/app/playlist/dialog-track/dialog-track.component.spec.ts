import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTrackComponent } from './dialog-track.component';

describe('DialogTrackComponent', () => {
  let component: DialogTrackComponent;
  let fixture: ComponentFixture<DialogTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
