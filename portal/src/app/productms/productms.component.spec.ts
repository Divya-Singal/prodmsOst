import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductmsComponent } from './productms.component';

describe('ProductmsComponent', () => {
  let component: ProductmsComponent;
  let fixture: ComponentFixture<ProductmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
