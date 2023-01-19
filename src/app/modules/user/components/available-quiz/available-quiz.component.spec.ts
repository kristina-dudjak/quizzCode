import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableQuizComponent } from './available-quiz.component';

describe('AvailableQuizComponent', () => {
  let component: AvailableQuizComponent;
  let fixture: ComponentFixture<AvailableQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableQuizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
