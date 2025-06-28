import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stamps } from './stamps';

describe('Stamps', () => {
  let component: Stamps;
  let fixture: ComponentFixture<Stamps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stamps]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stamps);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
