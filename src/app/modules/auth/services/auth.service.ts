import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Router } from '@angular/router'
import firebase from 'firebase/compat/app'
import { Store } from 'src/app/shared/classes/store.class'
import { User } from 'src/app/shared/models/User'

interface AuthInterface {
  user?: User
  errorMessage?: string
}

const initialState: AuthInterface = {
  user: undefined,
  errorMessage: undefined
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends Store<AuthInterface> {
  constructor (
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    super(initialState)
    this.firebaseAuth.onAuthStateChanged(user => {
      this.updateUserState(user)
    })
  }

  user$ = this.select(({ user }) => user)
  errorMessage$ = this.select(({ errorMessage }) => errorMessage)

  updateUserState (user: firebase.User) {
    if (!user) {
      this.setState({ user: undefined })
    } else {
      this.setState({ user: { uid: user.uid, email: user.email } })
    }
  }

  updateErrorMessageState (errorMessage: string) {
    this.setState({ errorMessage })
  }

  googleSignIn (rememberMe: boolean) {
    return this.firebaseAuth
      .setPersistence(rememberMe ? 'local' : 'session')
      .then(() => {
        this.firebaseAuth
          .signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then(result => {
            this.updateUserState(result.user)
            this.saveUserToDb(result.user)
            this.router.navigateByUrl('quizzes')
          })
          .catch(error => {
            this.updateErrorMessageState(error.message)
          })
      })
  }

  signIn (email: string, password: string, rememberMe: boolean) {
    return this.firebaseAuth
      .setPersistence(rememberMe ? 'local' : 'session')
      .then(() => {
        this.firebaseAuth
          .signInWithEmailAndPassword(email, password)
          .then(result => {
            this.updateUserState(result.user)
            this.router.navigateByUrl('quizzes')
          })
          .catch(error => {
            this.updateErrorMessageState(error.message)
          })
      })
  }

  signUp (email: string, password: string, rememberMe: boolean) {
    return this.firebaseAuth
      .setPersistence(rememberMe ? 'local' : 'session')
      .then(() => {
        this.firebaseAuth
          .createUserWithEmailAndPassword(email, password)
          .then(result => {
            this.updateUserState(result.user)
            this.saveUserToDb(result.user)
            this.router.navigateByUrl('quizzes')
          })
          .catch(error => {
            this.updateErrorMessageState(error.message)
          })
      })
  }

  signOut () {
    return this.firebaseAuth
      .signOut()
      .then(() => {
        this.updateUserState(undefined)
        this.router.navigateByUrl('login')
      })
      .catch(error => {
        this.updateErrorMessageState(error.message)
      })
  }

  sendPasswordResetEmail (email: string) {
    return this.firebaseAuth.sendPasswordResetEmail(email).catch(error => {
      this.updateErrorMessageState(error.message)
    })
  }

  saveUserToDb (user: firebase.User) {
    this.db.collection(`users`).doc(user.uid).set(
      {
        uid: user.uid,
        email: user.email
      },
      { merge: true }
    )
  }
}
