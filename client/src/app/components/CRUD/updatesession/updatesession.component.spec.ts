import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatesessionComponent } from './updatesession.component';

describe('UpdatesessionComponent', () => {
  let component: UpdatesessionComponent;
  let fixture: ComponentFixture<UpdatesessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatesessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatesessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
