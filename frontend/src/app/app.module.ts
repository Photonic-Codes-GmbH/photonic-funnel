import { APP_INITIALIZER, NgModule } from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ConfigService } from './core/services/config.service'
import { CoreModule } from './core/core.module'
import { SharedModule } from './shared/shared.module'
import { SyncfusionModule } from './syncfusion.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular'
import { UiEditorModule } from './pages/uiEditor/uieditor.module'
import { LayoutComponent } from './pages/uiEditor/elements/layout/layout.component'
import { ResizeHandlesComponent } from './pages/uiEditor/elements/layout/resizable/resize-handles.component'

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
    AppComponent,
    LayoutComponent
  ],
  imports: [
		CoreModule,
		SharedModule,
		HttpClientModule,
    BrowserModule,
		BrowserAnimationsModule,
    KeycloakAngularModule,
		SyncfusionModule,
    AppRoutingModule,
    UiEditorModule,
    ResizeHandlesComponent,
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
		AppComponent,
]
})
export class AppModule {
}
