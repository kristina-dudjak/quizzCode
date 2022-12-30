import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizzesDefaultComponent } from './quizzes-default.component';

describe('QuizzesDefaultComponent', () => {
  let component: QuizzesDefaultComponent;
  let fixture: ComponentFixture<QuizzesDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizzesDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizzesDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
