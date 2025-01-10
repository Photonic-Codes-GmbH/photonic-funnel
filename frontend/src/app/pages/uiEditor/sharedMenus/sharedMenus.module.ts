import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { Menu } from './_menu/menu'
import { MenuBorderComponent } from './border/menu-border.component'
import { ColorPickerMenu } from './colorPicker/colorPicker.menu'
import { DisabledMenu } from './disabled/disabled.menu'
import { DropdownMenu } from './dropdown/dropdown.menu'
import { MenuInputComponent } from './inputField/menu-input.component'
import { SharedMenusSfModule } from './sharedMenus.sf.module'
import { MenuSliderComponent } from './slider/slider.component'
import { ToggleMenu } from './toggle/toggle.menu'
import { UnitInputMenuComponent } from './unit-input/menu-unit-input.component'
import { AlignItemsMenuComponent } from './alignItems/alignItems.component'
import { JustifyContentComponent } from './justifyContent/justifyContent.component'
import { MenuButtonComponent } from './menuButton/menuButton.component'
import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'

// Das hier ist für die Übersetzung mit ngx-translate
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {

  return new TranslateHttpLoader(http)
}

const declarationsNexports = [
	Menu,
	MenuInputComponent,
	DisabledMenu,
	ToggleMenu,
	DropdownMenu,
	ColorPickerMenu,
	MenuSliderComponent,
	MenuBorderComponent,
	UnitInputMenuComponent,
	AlignItemsMenuComponent,
	JustifyContentComponent,
	MenuButtonComponent,
]

@NgModule({
	declarations: declarationsNexports,
  exports: declarationsNexports,
  imports: [
		CommonModule,
		SharedMenusSfModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		})
  ],
})

export class SharedMenusModule {
}
