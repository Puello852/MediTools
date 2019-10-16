import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './services/authentication.service';
import { ApiToolsService } from './services/api-tools.service'
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { DashboardHomePage } from './pages/dashboard-home/dashboard-home.page';
import { Camera } from '@ionic-native/camera/ngx';
import {File} from '@ionic-native/file/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RecaptchaModule } from 'ng-recaptcha';
import { IonicStorageModule } from '@ionic/storage';
import { EditProfilePage } from './pages/tabs/edit-profile/edit-profile.page';
import { HTTP } from '@ionic-native/http/ngx';
import { FiltroCitasPipe } from './Pipes/filtro-citas.pipe';
import { RefreshToken } from './interceptor-token.service';
@NgModule({
  declarations: [AppComponent,DashboardHomePage,EditProfilePage, FiltroCitasPipe],
  entryComponents: [EditProfilePage],
  imports: [
    RecaptchaModule.forRoot(),
    IonicStorageModule.forRoot(),
    FontAwesomeModule,
    HttpClientModule,
    
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserModule, AngularFireAuthModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    {provide: HTTP_INTERCEPTORS,useClass: RefreshToken,multi: true},
    AngularFireStorage,
    File,
    HTTP,
    Camera,
    ApiToolsService,
    AuthenticationService,
    StatusBar,
    SplashScreen,
    { provide: FirestoreSettingsToken, useValue: {} },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
