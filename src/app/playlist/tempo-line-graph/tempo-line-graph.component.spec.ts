import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempoLineGraphComponent } from './tempo-line-graph.component';

describe('TempoLineGraphComponent', () => {
  let component: TempoLineGraphComponent;
  let fixture: ComponentFixture<TempoLineGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TempoLineGraphComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempoLineGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
