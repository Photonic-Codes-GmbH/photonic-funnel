import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs'
import { LayoutComponent } from '../../elements/layout/layout.component'
import { Menu } from '../_menu/menu'

@Component({
    selector: 'input-field',
    templateUrl: './menu-input.component.html',
    standalone: false
})
export class MenuInputComponent extends Menu {

  @Input() width = "100%"
  @Input() shortName = ""
  @Input() min: number
  @Input() override value: string
  @Input() override isCss = true
  @Input() showClearButton = false
  @Input() type = "text"
  @Input() labelName = "placeholder"
	@Output() change = new EventEmitter<string>()

	private _name = ""
	public get propName() {

		return this._name
	}
	@Input()
	public set propName(value) { // This is basically the initialization of this menu
		
		this._name = value

		this.waitForSelectedObj()

		// Wird auch getriggert, wenn du ein Element eines anderen Typs auswählst
		this.uiEditorService.newElementSelected.subscribe((newSelected: LayoutComponent) => {

			// if(this.forType != newSelected.type) return
			this.initializeStuff(newSelected)
		})
	}

	async waitForSelectedObj(){

		let selectedObj = this.uiEditorService.selectedObjects[0]

		while(!selectedObj) {

			await new Promise(resolve => setTimeout(resolve, 100))
			selectedObj = this.uiEditorService.selectedObjects[0]
		}
		
		this.forType = selectedObj.type

		this.initializeStuff(selectedObj)
	}
	
	forType: string

	initializeStuff(newSelected: LayoutComponent){

		this.element = newSelected
		this.variable = "$" + this.element.kebabToCamelCase(this._name)

		let stringValue = this.element && this.propName ? (this.element as any)[this.variable] : ""
		// if(!stringValue && stringValue != "")
		// 			console.error(this._name, "Field: There is no variable", this.variable, "in the", this.element.type , "element", this.element)
		//
	}

	private element: LayoutComponent
	variable = ""

  public get inputValue(): string { return (this.element as any) ? (this.element as any)[this.variable] : "" }
  public set inputValue(value: string) {

    let stringValue = ""
    if(value) stringValue = value.toString()

    this.uiEditorService.setProperty({
      key: this.propName,
      value: stringValue,
      second: "",
      isCss: this.isCss,
      renderOnlyOuter: false
    })

		this.change.emit(value)
  }
}
