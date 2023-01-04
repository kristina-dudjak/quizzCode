import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizDefaultComponent } from './quiz-default.component';

describe('QuizDefaultComponent', () => {
  let component: QuizDefaultComponent;
  let fixture: ComponentFixture<QuizDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
