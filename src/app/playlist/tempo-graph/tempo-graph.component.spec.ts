import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempoGraphComponent } from './tempo-graph.component';

describe('TempoGraphComponent', () => {
  let component: TempoGraphComponent;
  let fixture: ComponentFixture<TempoGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempoGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempoGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
