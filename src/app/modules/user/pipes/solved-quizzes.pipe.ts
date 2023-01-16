import { Pipe, PipeTransform } from '@angular/core'
import { AttemptedQuiz } from 'src/app/shared/models/Quiz'

@Pipe({
  name: 'solvedQuizzes'
})
export class SolvedQuizzesPipe implements PipeTransform {
  transform (quizzes: AttemptedQuiz[], completed: Boolean): AttemptedQuiz[] {
    return quizzes.filter(quizzes => quizzes.isCompleted === completed)
  }
}
