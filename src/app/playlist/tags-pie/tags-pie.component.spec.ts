import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsPieComponent } from './tags-pie.component';

describe('TagsPieComponent', () => {
  let component: TagsPieComponent;
  let fixture: ComponentFixture<TagsPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
