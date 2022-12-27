import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolvedListComponent } from './solved-list.component';

describe('SolvedListComponent', () => {
  let component: SolvedListComponent;
  let fixture: ComponentFixture<SolvedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolvedListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolvedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
