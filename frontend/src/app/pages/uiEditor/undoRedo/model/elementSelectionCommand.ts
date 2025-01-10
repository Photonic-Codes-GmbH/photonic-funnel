import { LayoutComponent } from "../../elements/layout/layout.component"
import { UiEditorService } from "../../services/uiEditor.service"
import { Command } from "./command"

export class ElementSelection implements Command {

	/**
	 * # ElementSelectionCommand
	 * To perform undo/redo operations on selecting a LayoutComponent
	 * @param oldSelectionId The old Selection: string
	 * @param newSelectionId The new Selection: string
	 */
	constructor(
		public oldSelectionId: string,
		public newSelectionId: string,
		private uiEditorService: UiEditorService
	) {

		let oldLayout
		if(oldSelectionId) oldLayout = this.uiEditorService.findElementById(oldSelectionId)
		const newLayout = this.uiEditorService.findElementById(newSelectionId)!

		this.type = "Selection geändert von " + (oldSelectionId ? oldLayout.$displayName : "nichts") + " zu " + newLayout.$displayName
		this.time = new Date().toLocaleTimeString()
	}

	type: string
	time: string

	async execute() {

		const newLayout = this.uiEditorService.findElementById(this.newSelectionId)!
		this.uiEditorService.select(newLayout)
	}

	async undo() {
			
		const oldLayout = this.uiEditorService.findElementById(this.oldSelectionId)!
		this.uiEditorService.select(oldLayout)
	}
}
