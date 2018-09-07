import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminApplicationsSpecificComponent } from './admin-applications-specific.component';

describe('AdminApplicationsSpecificComponent', () => {
  let component: AdminApplicationsSpecificComponent;
  let fixture: ComponentFixture<AdminApplicationsSpecificComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminApplicationsSpecificComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminApplicationsSpecificComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
