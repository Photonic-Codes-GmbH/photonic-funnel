import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { MonacoEditorModule } from 'ngx-monaco-editor-v2'
import { RightSideElementMenusModule } from '../elements/syncfusion/rightSideElementMenus.module'
import { CustomCodeComponentMenu } from '../elements/customCode/customCode.menu'
import { SharedMenusModule } from '../sharedMenus/sharedMenus.module'
import { RightSideMenuComponent } from './rightSideMenu.component'
import { RightSideBasicMenusModule } from './rightSideMenus/rightSideBasicMenus.module'
import { FormsModule } from '@angular/forms'

// Das hier ist für die Übersetzung mit ngx-translate
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {

  return new TranslateHttpLoader(http)
}

const declarationsNexports = [
	RightSideMenuComponent,
	CustomCodeComponentMenu,
]

@NgModule({
	declarations: declarationsNexports,
	exports: declarationsNexports,
  imports: [
		CommonModule,
		RightSideBasicMenusModule,
		RightSideElementMenusModule,
		SharedMenusModule,
		FormsModule,
		MonacoEditorModule.forRoot(),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
  ],
})

export class RightSideMenuModule {
}
