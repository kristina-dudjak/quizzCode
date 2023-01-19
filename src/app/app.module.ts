import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AngularFireModule } from '@angular/fire/compat'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component'
import { HeaderComponent } from './shared/components/header/header.component'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
import { environment } from './environments/environment'

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
