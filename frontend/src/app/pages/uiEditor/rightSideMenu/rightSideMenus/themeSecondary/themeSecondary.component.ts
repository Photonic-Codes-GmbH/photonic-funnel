import { Component } from '@angular/core'
import { Menu } from '../../../sharedMenus/_menu/menu'

@Component({
    selector: 'themeSecondary',
    templateUrl: './themeSecondary.component.html',
    standalone: false
})
export class ThemeSecondaryComponent extends Menu {

	/**
	 * Sets the secondary Theme Color
	 * @param color For example: #e60505
	 */
	setSecondaryThemeColor(color: string) {

		this.setProp('theme-color-secondary', color)

		// Convert a value like #e60505 to r,g,b
		let r = parseInt(color.slice(1, 3), 16)
		let g = parseInt(color.slice(3, 5), 16)
		let b = parseInt(color.slice(5, 7), 16)

		// Das ist nur für Material. Es soll am Ende so aussehen: --color-sf-secondary: 13,110,253;
		document.documentElement.style.setProperty('--color-sf-secondary', `${r},${g},${b}`)
	}

	removeSecondaryThemeColor() {

		this.uiEditorService.removeProp('theme-color-secondary')
		document.documentElement.style.setProperty('--color-sf-secondary', `98, 91, 113`)
	}
}
