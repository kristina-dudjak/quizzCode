import { Pipe, PipeTransform } from '@angular/core'
import { AttemptedQuiz } from 'src/app/shared/models/Quiz'

@Pipe({
  name: 'solvedQuizzes'
})
export class SolvedQuizzesPipe implements PipeTransform {
  transform (quizzes: AttemptedQuiz[], completed: boolean): AttemptedQuiz[] {
    return completed
      ? quizzes.filter(quizzes => quizzes.isCompleted)
      : quizzes.filter(quizzes => !quizzes.isCompleted)
  }
}
