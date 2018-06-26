import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndclienteComponent } from './indcliente.component';

describe('IndclienteComponent', () => {
  let component: IndclienteComponent;
  let fixture: ComponentFixture<IndclienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndclienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
