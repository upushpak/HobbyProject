import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStamp } from './add-stamp';

describe('AddStamp', () => {
  let component: AddStamp;
  let fixture: ComponentFixture<AddStamp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStamp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStamp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
