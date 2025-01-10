import { Component } from '@angular/core'
import { Menu } from '../../../sharedMenus/_menu/menu'

@Component({
    selector: 'themePrimary',
    templateUrl: './themePrimary.component.html',
    standalone: false
})
export class ThemePrimaryComponent extends Menu {

	/**
	 * Sets the Theme Color
	 * @param color For example: #e60505
	 */
	setThemeColor(color: string) {

		this.setProp('theme-color-primary', color)

		// Convert a value like #e60505 to r,g,b
		let r = parseInt(color.slice(1, 3), 16)
		let g = parseInt(color.slice(3, 5), 16)
		let b = parseInt(color.slice(5, 7), 16)

		// Das ist nur für Material. Es soll am Ende so aussehen: --color-sf-primary: 13,110,253;
		document.documentElement.style.setProperty('--color-sf-primary', `${r},${g},${b}`)
	}

	removePrimaryThemeColor() {

		this.uiEditorService.removeProp('theme-color-primary')
		document.documentElement.style.setProperty('--color-sf-primary', `13,110,253`)
	}

}
