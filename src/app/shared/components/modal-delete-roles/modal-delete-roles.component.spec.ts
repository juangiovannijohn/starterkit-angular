import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteRolesComponent } from './modal-delete-roles.component';

describe('ModalDeleteRolesComponent', () => {
  let component: ModalDeleteRolesComponent;
  let fixture: ComponentFixture<ModalDeleteRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDeleteRolesComponent]
    });
    fixture = TestBed.createComponent(ModalDeleteRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
