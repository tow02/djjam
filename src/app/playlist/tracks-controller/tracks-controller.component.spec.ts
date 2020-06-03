import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracksControllerComponent } from './tracks-controller.component';

describe('TracksControllerComponent', () => {
  let component: TracksControllerComponent;
  let fixture: ComponentFixture<TracksControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracksControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracksControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
