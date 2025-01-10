import { UiEditorService } from "../../services/uiEditor.service"
import { Command } from "./command"

export class MoveInto implements Command {

	/**
	 * # Element Move Into Command
	 * To perform move operations of LayoutComponents into other LayoutComponents the UI
	 * @param oldParentId The old parent id
	 * @param oldIndex The old index number in the arrays of the parent
	 * @param newParentId The new parent id
	 * @param movedLayoutId The layout that is moved
	 * @param uiEditorService The UiEditorService
	 */
	constructor(
		private oldParentId: string,
		private oldIndex: number,
		private newParentId: string,
		private movedLayoutId: string,
		private uiEditorService: UiEditorService
	) {

		const movedLayout = this.uiEditorService.findElementById(movedLayoutId)!
		this.type = movedLayout.type + " in Layout verschoben"
		this.time = new Date().toLocaleTimeString()
	}

	type: string
	time: string

	async execute() {

		const newParent = this.uiEditorService.findElementById(this.newParentId)!
		const movedLayout = this.uiEditorService.findElementById(this.movedLayoutId)!
		this.uiEditorService.moveElementInto(newParent, movedLayout)
	}

	async undo() {

		const oldParent = this.uiEditorService.findElementById(this.oldParentId)!
		const movedLayout = this.uiEditorService.findElementById(this.movedLayoutId)!
		this.uiEditorService.moveElementToIndex(oldParent, this.oldIndex, movedLayout)
	}
}
