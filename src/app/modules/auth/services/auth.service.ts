import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Router } from '@angular/router'
import firebase from 'firebase/compat/app'
import { firstValueFrom, map } from 'rxjs'
import { StoreService } from 'src/app/shared/services/store.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor (
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private storeService: StoreService
  ) {
    this.firebaseAuth.onAuthStateChanged(user => {
      this.storeService.updateUserState(user)
      if (user) this.checkIfAdmin(user)
    })
  }

  checkIfAdmin (user: firebase.User) {
    firstValueFrom(
      this.db
        .collection('users')
        .doc(user.uid)
        .get()
        .pipe(
          map(doc => {
            if (doc.data()['isAdmin']) {
              this.storeService.updateIsAdminInUser(doc.data()['isAdmin'])
            }
          })
        )
    )
  }

  googleSignIn (rememberMe: boolean) {
    return this.firebaseAuth
      .setPersistence(rememberMe ? 'local' : 'session')
      .then(() => {
        this.firebaseAuth
          .signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then(result => {
            this.storeService.updateUserState(result.user)
            this.saveUserToDb(result.user)
            this.router.navigateByUrl('quizzes')
          })
          .catch(error => {
            this.storeService.updateErrorMessageState(error.message)
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
            this.storeService.updateUserState(result.user)
            this.router.navigateByUrl('quizzes')
          })
          .catch(error => {
            this.storeService.updateErrorMessageState(error.message)
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
            this.storeService.updateUserState(result.user)
            this.saveUserToDb(result.user)
            this.router.navigateByUrl('quizzes')
          })
          .catch(error => {
            this.storeService.updateErrorMessageState(error.message)
          })
      })
  }

  signOut () {
    return this.firebaseAuth
      .signOut()
      .then(() => {
        this.storeService.updateUserState(undefined)
        this.router.navigateByUrl('login')
      })
      .catch(error => {
        this.storeService.updateErrorMessageState(error.message)
      })
  }

  sendPasswordResetEmail (email: string) {
    return this.firebaseAuth.sendPasswordResetEmail(email).catch(error => {
      this.storeService.updateErrorMessageState(error.message)
    })
  }

  saveUserToDb (user: firebase.User) {
    this.db.collection(`users`).doc(user.uid).set(
      {
        uid: user.uid,
        email: user.email,
        isAdmin: false
      },
      { merge: true }
    )
  }
}
