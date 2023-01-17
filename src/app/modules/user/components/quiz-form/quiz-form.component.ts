import { Component, Input } from '@angular/core'
import { Answer } from 'src/app/shared/models/Answer'
import { Question } from 'src/app/shared/models/Question'
import { AttemptedQuiz } from 'src/app/shared/models/Quiz'
import { User } from 'src/app/shared/models/User'
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.scss']
})
export class QuizFormComponent {
  constructor (private userService: UserService) {}

  @Input() user: User
  @Input() attemptedQuiz: AttemptedQuiz
  @Input() index: number
  @Input() questions: Question[]

  onButtonChange (questions: Question[], answer: Answer) {
    this.userService.saveQuizQuestion(
      {
        name: questions[this.index].name,
        id: questions[this.index].id,
        answers: [answer]
      },
      this.user,
      this.attemptedQuiz
    )
  }

  isChecked (question: Question, userQuestions: Question[], answerName: string) {
    return userQuestions.some(
      q =>
        q.name === question.name &&
        q.answers.some(ans => ans.name === answerName)
    )
  }
}
