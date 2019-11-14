import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorymsComponent } from './categoryms.component';

describe('CategorymsComponent', () => {
  let component: CategorymsComponent;
  let fixture: ComponentFixture<CategorymsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorymsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorymsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
