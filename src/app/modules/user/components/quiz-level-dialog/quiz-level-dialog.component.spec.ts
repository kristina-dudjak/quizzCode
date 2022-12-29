import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizLevelDialogComponent } from './quiz-level-dialog.component';

describe('QuizLevelDialogComponent', () => {
  let component: QuizLevelDialogComponent;
  let fixture: ComponentFixture<QuizLevelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizLevelDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizLevelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
