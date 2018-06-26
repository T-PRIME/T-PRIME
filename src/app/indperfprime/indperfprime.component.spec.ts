import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndperfprimeComponent } from './indperfprime.component';

describe('IndperfprimeComponent', () => {
  let component: IndperfprimeComponent;
  let fixture: ComponentFixture<IndperfprimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndperfprimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndperfprimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
