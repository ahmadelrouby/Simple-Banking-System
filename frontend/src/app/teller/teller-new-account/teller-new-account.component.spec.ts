import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerNewAccountComponent } from './teller-new-account.component';

describe('TellerNewAccountComponent', () => {
  let component: TellerNewAccountComponent;
  let fixture: ComponentFixture<TellerNewAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellerNewAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerNewAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
