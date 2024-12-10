import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrderDetailsComponent } from './confirm-order-details.component';

describe('ConfirmOrderDetailsComponent', () => {
  let component: ConfirmOrderDetailsComponent;
  let fixture: ComponentFixture<ConfirmOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
