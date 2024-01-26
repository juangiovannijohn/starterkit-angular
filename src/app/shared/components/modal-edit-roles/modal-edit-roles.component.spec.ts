import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditRolesComponent } from './modal-edit-roles.component';

describe('ModalEditRolesComponent', () => {
  let component: ModalEditRolesComponent;
  let fixture: ComponentFixture<ModalEditRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEditRolesComponent]
    });
    fixture = TestBed.createComponent(ModalEditRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
