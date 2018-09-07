import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewAccountComponent } from './admin-new-account.component';

describe('AdminNewAccountComponent', () => {
  let component: AdminNewAccountComponent;
  let fixture: ComponentFixture<AdminNewAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNewAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNewAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
