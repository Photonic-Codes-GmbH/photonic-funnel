export interface Command {
	
	type: string
	time: string
	execute(): Promise<void>
	undo(): Promise<void>
}