import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientViewAccountsComponent } from './client-view-accounts.component';

describe('ClientViewAccountsComponent', () => {
  let component: ClientViewAccountsComponent;
  let fixture: ComponentFixture<ClientViewAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientViewAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientViewAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
