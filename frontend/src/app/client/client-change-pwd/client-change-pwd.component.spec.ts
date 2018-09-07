import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientChangePwdComponent } from './client-change-pwd.component';

describe('ClientChangePwdComponent', () => {
  let component: ClientChangePwdComponent;
  let fixture: ComponentFixture<ClientChangePwdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientChangePwdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientChangePwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
