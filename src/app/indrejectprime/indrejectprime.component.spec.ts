import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndrejectprimeComponent } from './indrejectprime.component';

describe('IndrejectprimeComponent', () => {
  let component: IndrejectprimeComponent;
  let fixture: ComponentFixture<IndrejectprimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndrejectprimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndrejectprimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
