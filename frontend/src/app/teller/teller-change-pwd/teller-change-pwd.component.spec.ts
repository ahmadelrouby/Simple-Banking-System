import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerChangePwdComponent } from './teller-change-pwd.component';

describe('TellerChangePwdComponent', () => {
  let component: TellerChangePwdComponent;
  let fixture: ComponentFixture<TellerChangePwdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellerChangePwdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerChangePwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
