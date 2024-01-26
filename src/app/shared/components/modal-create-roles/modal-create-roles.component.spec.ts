import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateRolesComponent } from './modal-create-roles.component';

describe('ModalCreateRolesComponent', () => {
  let component: ModalCreateRolesComponent;
  let fixture: ComponentFixture<ModalCreateRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCreateRolesComponent]
    });
    fixture = TestBed.createComponent(ModalCreateRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
