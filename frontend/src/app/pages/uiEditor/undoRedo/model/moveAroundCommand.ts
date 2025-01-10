import { UiEditorService } from "../../services/uiEditor.service"
import { Command } from "./command"

export class MoveAround implements Command {

	/**
	 * # Move Around Command
	 * To perform move operations of LayoutComponents around other LayoutComponents the TreeView
	 * @param oldParentId The old parent id
	 * @param oldIndex The old index number in the arrays of the parent
	 * @param droppedAroundId The id of the element that the movedLayout was dropped around
	 * @param newParentId The new parent id
	 * @param movedLayoutId The layout that is moved
	 * @param after If the movedLayout was dropped after the droppedAround Layout or not
	 * @param uiEditorService The UiEditorService
	 */
	constructor(
		private oldParentId: string,
		private oldIndex: number,
		private droppedAroundId: string,
		private newParentId: string,
		private movedLayoutId: string,
		private after: boolean,
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
		const droppedAround = this.uiEditorService.findElementById(this.droppedAroundId)!
		this.uiEditorService.moveElementAround(newParent, droppedAround, movedLayout, this.after)
	}

	async undo() {

		const oldParent = this.uiEditorService.findElementById(this.oldParentId)!
		const movedLayout = this.uiEditorService.findElementById(this.movedLayoutId)!
		this.uiEditorService.moveElementToIndex(oldParent, this.oldIndex, movedLayout)
	}
}
