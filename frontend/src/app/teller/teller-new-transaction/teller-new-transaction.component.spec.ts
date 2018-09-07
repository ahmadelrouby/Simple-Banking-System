import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerNewTransactionComponent } from './teller-new-transaction.component';

describe('TellerNewTransactionComponent', () => {
  let component: TellerNewTransactionComponent;
  let fixture: ComponentFixture<TellerNewTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellerNewTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerNewTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
