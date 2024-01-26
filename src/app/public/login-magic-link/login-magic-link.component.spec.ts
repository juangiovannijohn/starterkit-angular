import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMagicLinkComponent } from './login-magic-link.component';

describe('LoginMagicLinkComponent', () => {
  let component: LoginMagicLinkComponent;
  let fixture: ComponentFixture<LoginMagicLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginMagicLinkComponent]
    });
    fixture = TestBed.createComponent(LoginMagicLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
