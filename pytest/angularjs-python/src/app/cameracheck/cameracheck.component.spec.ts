import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameracheckComponent } from './cameracheck.component';

describe('CameracheckComponent', () => {
  let component: CameracheckComponent;
  let fixture: ComponentFixture<CameracheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameracheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameracheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
