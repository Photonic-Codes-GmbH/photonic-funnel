import { v4 as uuidv4 } from 'uuid'
import { Property } from "./property"

export class SaveLayout {

	constructor(type?: string) {

		if(!type) type = 'layout'

		this.type = type ? type : 'layout'
		this.children = []
		this.isLayout = type == 'layout'
		this.properties = []
	}

	public id: string = uuidv4()
  public type: string
  public children: SaveLayout[]
  public isLayout: boolean
	public properties: Property[]

	getClone(){
		
		let clone = new SaveLayout(this.type)
		clone.children = this.children.map(child => child.getClone())
		clone.isLayout = this.isLayout
		clone.properties = JSON.parse(JSON.stringify(this.properties))
		return clone
	}
}
