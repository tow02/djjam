import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsCharacterComponent } from './artists-character.component';

describe('ArtistsCharacterComponent', () => {
  let component: ArtistsCharacterComponent;
  let fixture: ComponentFixture<ArtistsCharacterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArtistsCharacterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistsCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
