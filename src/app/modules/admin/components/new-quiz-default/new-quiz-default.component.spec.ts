import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuizDefaultComponent } from './new-quiz-default.component';

describe('NewQuizDefaultComponent', () => {
  let component: NewQuizDefaultComponent;
  let fixture: ComponentFixture<NewQuizDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewQuizDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQuizDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
