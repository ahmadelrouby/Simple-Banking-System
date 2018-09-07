import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerViewAccountsComponent } from './teller-view-accounts.component';

describe('TellerViewAccountsComponent', () => {
  let component: TellerViewAccountsComponent;
  let fixture: ComponentFixture<TellerViewAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellerViewAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerViewAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
