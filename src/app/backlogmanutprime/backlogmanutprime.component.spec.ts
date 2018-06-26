import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklogmanutprimeComponent } from './backlogmanutprime.component';

describe('BacklogmanutprimeComponent', () => {
  let component: BacklogmanutprimeComponent;
  let fixture: ComponentFixture<BacklogmanutprimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BacklogmanutprimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BacklogmanutprimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
