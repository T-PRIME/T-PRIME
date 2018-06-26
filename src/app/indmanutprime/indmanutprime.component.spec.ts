import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndmanutprimeComponent } from './indmanutprime.component';


describe('IndmanutprimeComponent', () => {
  let component: IndmanutprimeComponent;
  let fixture: ComponentFixture<IndmanutprimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndmanutprimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndmanutprimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
