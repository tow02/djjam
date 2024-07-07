import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElasticTracksComponent } from './elastic-tracks.component';

describe('ElasticTracksComponent', () => {
  let component: ElasticTracksComponent;
  let fixture: ComponentFixture<ElasticTracksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ElasticTracksComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElasticTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
