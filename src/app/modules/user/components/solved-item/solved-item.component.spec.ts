import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolvedItemComponent } from './solved-item.component';

describe('SolvedItemComponent', () => {
  let component: SolvedItemComponent;
  let fixture: ComponentFixture<SolvedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolvedItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolvedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
