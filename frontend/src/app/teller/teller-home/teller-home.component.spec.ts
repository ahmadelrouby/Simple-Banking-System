import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerHomeComponent } from './teller-home.component';

describe('TellerHomeComponent', () => {
  let component: TellerHomeComponent;
  let fixture: ComponentFixture<TellerHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellerHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
