import { SaveLayout } from "../../model/saveLayout"
import { UiEditorService } from "../../services/uiEditor.service"
import { Command } from "./command"

export class CreationDeletion implements Command {

	/**
	 * # ElementCreationDeletionCommand
	 * To perform creation and deletion operations on LayoutComponents.
	 * 
	 * **One of the two must be a LayoutComponent**
	 * 
	 * **One of the two must be undefined**
	 * @param parentId The parent object - where the element was created or deleted
	 * @param oldSaveLayout The old SaveLayout, that was there: SaveLayout | undefined
	 * @param oldIndex The old index, where the element was: number
	 * @param newSaveLayout The new SaveLayout, that was there: SaveLayout | undefined
	 * @param uiEditorService The UiEditorService
	 */
	constructor(
		public parentId: string,
		public oldSaveLayout: SaveLayout | undefined,
		public oldIndex: number | undefined,
		public newSaveLayout: SaveLayout | undefined,
		private uiEditorService: UiEditorService
	) {

		this.create = !!newSaveLayout
		this.delete = !!oldSaveLayout

		if(this.create && newSaveLayout) this.type = newSaveLayout.type + "Element erstellt"
		
		if(this.delete && oldSaveLayout) this.type = oldSaveLayout.type + "Element gelöscht"
		this.time = new Date().toLocaleTimeString()
	}

	create: boolean
	delete: boolean
	type: string
	time: string

	async execute() {

		if(this.create) await this.uiEditorService.clone(this.uiEditorService.findElementById(this.parentId)!, this.newSaveLayout!)
		if(this.delete) this.uiEditorService.findElementById(this.oldSaveLayout!.id)!.deleteMe()
	}
	// Sowohl bei execute, als auch bei undo muss die ID des Elements beibehalten werden, um es wiederherstellen zu können
	async undo() {

		const uiEditor = this.uiEditorService

		if(this.create) uiEditor.findElementById(this.newSaveLayout!.id)!.deleteMe()
		if(this.delete) await uiEditor.clone(uiEditor.findElementById(this.parentId)!, this.oldSaveLayout!, this.oldIndex)
	}
}
