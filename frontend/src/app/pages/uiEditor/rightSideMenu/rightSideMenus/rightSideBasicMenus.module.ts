import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedMenusModule } from '../../sharedMenus/sharedMenus.module'
import { MenuBackgroundComponent } from './background/menu-background.component'
import { MenuBoxShadowComponent } from './box-shadow/menu-box-shadow.component'
import { CodeNstyleButtonRowComponent } from './codeNstyleButtonRow/codeNstyleButtonRow.component'
import { DimensionsComponent } from './dimensions/dimensions.component'
import { LayoutOptionsComponent } from './layoutOptions/layoutOptions.component'
import { PositioningComponent } from './positioning/positioning.component'
import { PropertyDebugAreaComponent } from './propertyDebugArea/propertyDebugArea.component'
import { SpacingComponent } from './spacing/spacing.component'
import { ThemePrimaryComponent } from './themePrimary/themePrimary.component'
import { ThemeSecondaryComponent } from './themeSecondary/themeSecondary.component'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { HttpClient } from '@angular/common/http'

// Das hier ist für die Übersetzung mit ngx-translate
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {

  return new TranslateHttpLoader(http)
}

const declarationsNexports = [
	MenuBackgroundComponent,
	MenuBoxShadowComponent,
	ThemePrimaryComponent,
	ThemeSecondaryComponent,
	DimensionsComponent,
	SpacingComponent,
	PositioningComponent,
	LayoutOptionsComponent,
	CodeNstyleButtonRowComponent,
	PropertyDebugAreaComponent,
]

@NgModule({
	declarations: declarationsNexports,
  exports: declarationsNexports,
  imports: [
		CommonModule,
		SharedMenusModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
  ],
})

export class RightSideBasicMenusModule {
}
