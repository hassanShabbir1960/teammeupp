import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecoachComponent } from './createcoach.component';

describe('CreatecoachComponent', () => {
  let component: CreatecoachComponent;
  let fixture: ComponentFixture<CreatecoachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatecoachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatecoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
