import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateplayerComponent } from './updateplayer.component';

describe('UpdateplayerComponent', () => {
  let component: UpdateplayerComponent;
  let fixture: ComponentFixture<UpdateplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateplayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
