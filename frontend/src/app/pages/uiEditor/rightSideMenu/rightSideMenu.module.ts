import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { CustomCodeComponentMenu } from '../elements/customCode/customCode.menu'
import { RightSideElementMenusModule } from '../elements/syncfusion/rightSideElementMenus.module'
import { SharedMenusModule } from '../sharedMenus/sharedMenus.module'
import { RightSideMenuComponent } from './rightSideMenu.component'
import { RightSideBasicMenusModule } from './rightSideMenus/rightSideBasicMenus.module'

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
