import { Component } from '@angular/core'
import { CommandManagerService } from '../services/commandManager.service'

@Component({
    selector: 'undoRedo',
    templateUrl: './command.component.html',
    styleUrls: ['./command.component.scss'],
    standalone: false
})
export class CommandComponent {

	constructor(public commandManager: CommandManagerService) {}

	undo() { this.commandManager.undo() }
	redo() { this.commandManager.redo() }

	get canUndo(): boolean { return this.commandManager.canUndo }
	get canRedo(): boolean { return this.commandManager.canRedo }
}
