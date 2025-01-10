import { Property } from "../../model/property"
import { UiEditorService } from "../../services/uiEditor.service"
import { Command } from "./command"

export class PropertyChange implements Command {

	/**
	 * # ChangePropertyCommand
	 * To perform undo/redo operations on changing a property of a LayoutComponent
	 * @param elementId The element that was changed: string
	 * @param oldProp The old property: Property
	 * @param newProp The new property: Property
	 * @param uiEditorService The UiEditorService
	 */
	constructor(
		public elementId: string,
		public oldProp: Property | undefined,
		public newProp: Property,
		private uiEditorService: UiEditorService
	) {

		this.type = newProp.key + " geändert von " + (oldProp ? oldProp.value : "nichts") + " zu " + newProp.value
		this.time = new Date().toLocaleTimeString()
	}

	type: string
	time: string

	async execute() {

		const elementLayout = this.uiEditorService.findElementById(this.elementId)!
		elementLayout.setAndRenderProp(this.newProp)
	}

	async undo() {
		
		const elementLayout = this.uiEditorService.findElementById(this.elementId)!
		if(this.oldProp) elementLayout.setAndRenderProp(this.oldProp)
		else elementLayout.removeProp(this.newProp.key)
	}
}
