import { Component, ViewChild, ViewContainerRef } from '@angular/core'
import { LayoutComponent } from '../../layout/layout.component'
import { SaveLayout } from '../../../model/saveLayout'

// Das + muss in template expressions immer am getProp, weil der compiler sonst meckert
const template = `<button ejs-button [cssClass]="'e-'+$type" [isPrimary]="+$isPrimary == 1">{{$text}}</button>`

@Component({
    selector: 'sf-button',
    template: `<ng-container #dynamicContainer></ng-container>`,
    standalone: false
})
export class ButtonComponent extends LayoutComponent {

	@ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
	container!: ViewContainerRef

	async instantiate() {

		const { ButtonComponent } = await import('@syncfusion/ej2-angular-buttons')

		this.container.clear()
		const newComponentRef = this.container.createComponent(ButtonComponent)
		const buttonComponent = newComponentRef.instance

		this.setPropAsHelper('isPrimary', '1')
		buttonComponent.isPrimary = this.$isPrimary == '1'

		this.setPropAsHelper('text', 'button')
		buttonComponent.content = this.$text

		this.uiEditorService.onPropSet.subscribe((saveLayout: SaveLayout) => {

			if(saveLayout.id != this.id) return

			buttonComponent.isPrimary = this.$isPrimary == '1'
			buttonComponent.content = this.$text
			buttonComponent.cssClass = 'e-'+this.$type
		})
	}

	template = template

	$type = ''
	$isPrimary = ''
	$text = ''
}
