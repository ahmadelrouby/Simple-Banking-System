import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminApplicationsAllComponent } from './admin-applications-all.component';

describe('AdminApplicationsAllComponent', () => {
  let component: AdminApplicationsAllComponent;
  let fixture: ComponentFixture<AdminApplicationsAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminApplicationsAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminApplicationsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
