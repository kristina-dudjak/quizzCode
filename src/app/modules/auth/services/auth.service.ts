import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Router } from '@angular/router'
import firebase from 'firebase/compat/app'
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
    this.firebaseAuth.onAuthStateChanged(async user => {
      if (user) {
        this.storeService.updateUserState(user, await this.checkIfAdmin(user))
        await this.checkIfAdmin(user)
      }
    })
  }

  async checkIfAdmin (user: firebase.User) {
    return await (
      await this.db.collection(`users`).doc(user.uid).ref.get()
    ).data()['isAdmin']
  }

  async googleSignIn (rememberMe: boolean) {
    await this.firebaseAuth.setPersistence(rememberMe ? 'local' : 'session')
    await this.firebaseAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(async result => {
        await this.saveUserToDb(result.user)
        this.router.navigateByUrl('quizzes')
      })
      .catch(error => {
        this.storeService.updateErrorMessageState(error.message)
      })
  }

  async signIn (email: string, password: string, rememberMe: boolean) {
    await this.firebaseAuth.setPersistence(rememberMe ? 'local' : 'session')
    await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.storeService.updateErrorMessageState(error.message)
      })
    this.router.navigateByUrl('quizzes')
  }

  async signUp (email: string, password: string, rememberMe: boolean) {
    await this.firebaseAuth.setPersistence(rememberMe ? 'local' : 'session')
    await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(async result => {
        await this.saveUserToDb(result.user)
        this.router.navigateByUrl('quizzes')
      })
      .catch(error => {
        this.storeService.updateErrorMessageState(error.message)
      })
  }

  async signOut () {
    await this.firebaseAuth.signOut().catch(error => {
      this.storeService.updateErrorMessageState(error.message)
    })
    this.router.navigateByUrl('login')
  }

  async sendPasswordResetEmail (email: string) {
    await this.firebaseAuth.sendPasswordResetEmail(email).catch(error => {
      this.storeService.updateErrorMessageState(error.message)
    })
  }

  async saveUserToDb (user: firebase.User) {
    const userRef = this.db.collection(`users`).doc(user.uid).ref
    if ((await userRef.get()).exists) return
    userRef.set(
      {
        uid: user.uid,
        email: user.email,
        isAdmin: false
      },
      { merge: true }
    )
  }
}
