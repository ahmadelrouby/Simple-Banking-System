import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerNewClientComponent } from './teller-new-client.component';

describe('TellerNewClientComponent', () => {
  let component: TellerNewClientComponent;
  let fixture: ComponentFixture<TellerNewClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellerNewClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerNewClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
