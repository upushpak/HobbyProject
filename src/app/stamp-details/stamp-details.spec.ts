import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampDetails } from './stamp-details';

describe('StampDetails', () => {
  let component: StampDetails;
  let fixture: ComponentFixture<StampDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StampDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StampDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
