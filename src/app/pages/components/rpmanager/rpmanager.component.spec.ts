import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpmanagerComponent } from './rpmanager.component';

describe('RpmanagerComponent', () => {
  let component: RpmanagerComponent;
  let fixture: ComponentFixture<RpmanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RpmanagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
