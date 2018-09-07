import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTransferMoneyComponent } from './client-transfer-money.component';

describe('ClientTransferMoneyComponent', () => {
  let component: ClientTransferMoneyComponent;
  let fixture: ComponentFixture<ClientTransferMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTransferMoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTransferMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
