import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DueDateEditComponent } from './due-date-edit.component';

describe('DueDateEditComponent', () => {
  let component: DueDateEditComponent;
  let fixture: ComponentFixture<DueDateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DueDateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DueDateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
