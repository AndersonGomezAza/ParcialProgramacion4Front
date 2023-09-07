import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuenosComponent } from './duenos.component';

describe('DuenosComponent', () => {
  let component: DuenosComponent;
  let fixture: ComponentFixture<DuenosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DuenosComponent]
    });
    fixture = TestBed.createComponent(DuenosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
