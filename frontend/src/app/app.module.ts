import { APP_INITIALIZER, NgModule } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular'

import { CoreModule } from './core/core.module'
import { SharedModule } from './shared/shared.module'
import { ConfigService } from './core/services/config.service'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SyncfusionModule } from './syncfusion.module'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

function initializeKeycloak(keycloak: KeycloakService, configService: ConfigService) {
  return () => keycloak.init({
    config: {
      url: configService.config.keycloak.url,
      realm: configService.config.keycloak.realm,
      clientId: configService.config.keycloak.clientId
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
    },
    loadUserProfileAtStartUp: true
  })
}

// Das hier ist für die Übersetzung mit ngx-translate
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {

  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    KeycloakAngularModule,
    AppRoutingModule,
    SyncfusionModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    HttpClient,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, ConfigService]
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
