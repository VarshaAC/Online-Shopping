import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductOrderDetailsComponent } from './admin-product-order-details.component';

describe('AdminProductOrderDetailsComponent', () => {
  let component: AdminProductOrderDetailsComponent;
  let fixture: ComponentFixture<AdminProductOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminProductOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
