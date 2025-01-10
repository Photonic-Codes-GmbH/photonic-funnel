import { v4 as uuid } from 'uuid'

export class Project {

	public id?: string

	public name: string

	public constructor(name: string) {
		
		this.name = name
	}
}
