import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeleteAccountComponent } from './admin-delete-account.component';

describe('AdminDeleteAccountComponent', () => {
  let component: AdminDeleteAccountComponent;
  let fixture: ComponentFixture<AdminDeleteAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDeleteAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeleteAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
