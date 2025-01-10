import { Component } from '@angular/core'
import { Menu } from '../../../sharedMenus/_menu/menu'

@Component({
    selector: 'positioning',
    templateUrl: './positioning.component.html',
    styleUrls: ['./positioning.component.scss'],
    standalone: false
})
export class PositioningComponent extends Menu {

	switchCenter() {
		let isActive = this.uiEditorService.hasProp('transform')

		if (isActive) {
			this.uiEditorService.removeProp('transform')
		} else {
			this.setProp('left', '50', '%', true)
			this.setProp('top', '50', '%', true)
			this.uiEditorService.removeProp('right')
			this.uiEditorService.removeProp('bottom')
			this.setProp('transform', 'translate(-50%, -50%)', '', true)
		}
	}
}
