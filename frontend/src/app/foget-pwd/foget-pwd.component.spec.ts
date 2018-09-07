import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FogetPwdComponent } from './foget-pwd.component';

describe('FogetPwdComponent', () => {
  let component: FogetPwdComponent;
  let fixture: ComponentFixture<FogetPwdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FogetPwdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FogetPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
