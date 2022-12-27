import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AngularFireModule } from '@angular/fire/compat'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { environment } from '../environments/environment';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component'

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
