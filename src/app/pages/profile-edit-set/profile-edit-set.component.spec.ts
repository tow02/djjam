import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditSetComponent } from './profile-edit-set.component';

describe('ProfileEditSetComponent', () => {
  let component: ProfileEditSetComponent;
  let fixture: ComponentFixture<ProfileEditSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEditSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
