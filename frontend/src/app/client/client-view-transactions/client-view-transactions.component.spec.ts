import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientViewTransactionsComponent } from './client-view-transactions.component';

describe('ClientViewTransactionsComponent', () => {
  let component: ClientViewTransactionsComponent;
  let fixture: ComponentFixture<ClientViewTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientViewTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientViewTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
