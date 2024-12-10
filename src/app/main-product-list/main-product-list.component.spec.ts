import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainProductListComponent } from './main-product-list.component';

describe('MainProductListComponent', () => {
  let component: MainProductListComponent;
  let fixture: ComponentFixture<MainProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainProductListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
