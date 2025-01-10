import { Injectable } from "@angular/core"
import { UiEditorService } from "../../services/uiEditor.service"
import { Command } from "../model/command"

@Injectable()
export class CommandManagerService {

	busy = false

	constructor(private uiEditorService: UiEditorService) {

		this.uiEditorService.commands = this
	}

	public undoStack: Command[] = []
	public redoStack: Command[] = []

	push(command: Command) {

		this.undoStack.push(command)
		this.redoStack = [] // Redo wird geleert, da neue Befehle die Redo-Historie ungültig machen
	}

	async executeCommand(command: Command) {

		this.busy = true

		await command.execute()
		this.undoStack.push(command)
		this.redoStack = [] // Redo wird geleert, da neue Befehle die Redo-Historie ungültig machen

		this.busy = false
	}

	async undo() {

		this.busy = true

		const command = this.undoStack.pop()!

		await command.undo()
		this.redoStack.push(command)

		this.uiEditorService.changeDetector.detectChanges()

		this.busy = false
	}

	async redo() {

		this.busy = true

		const command = this.redoStack.pop()!

		await command.execute()
		this.undoStack.push(command)

		this.busy = false
	}

	get canUndo(): boolean { return this.undoStack.length > 0 }
	get canRedo(): boolean { return this.redoStack.length > 0 }
}
