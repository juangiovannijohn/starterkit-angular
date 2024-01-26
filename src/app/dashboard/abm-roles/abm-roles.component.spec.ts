import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmRolesComponent } from './abm-roles.component';

describe('AbmRolesComponent', () => {
  let component: AbmRolesComponent;
  let fixture: ComponentFixture<AbmRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbmRolesComponent]
    });
    fixture = TestBed.createComponent(AbmRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
