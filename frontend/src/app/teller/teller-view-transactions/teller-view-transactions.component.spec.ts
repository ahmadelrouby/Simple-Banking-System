import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerViewTransactionsComponent } from './teller-view-transactions.component';

describe('TellerViewTransactionsComponent', () => {
  let component: TellerViewTransactionsComponent;
  let fixture: ComponentFixture<TellerViewTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellerViewTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerViewTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
