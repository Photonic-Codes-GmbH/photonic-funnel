import { Component, Input } from '@angular/core'
import { Menu } from '../_menu/menu'
import { LayoutComponent } from '../../elements/layout/layout.component'

@Component({
    selector: 'menu-unit-input',
    templateUrl: './menu-unit-input.component.html',
    standalone: false
})
export class UnitInputMenuComponent extends Menu {

  @Input() override isCss = true
  @Input() disabled = false
  @Input() override renderOnlyOuter = true

  @Input() width = "0"

	private _name = ""
	public get name() {

		return this._name
	}
	@Input()
	public set name(value) { // This is basically the initialization of this menu

		this._name = value

		this.initializeStuff(this.uiEditorService.selectedObjects[0])

		this.uiEditorService.newElementSelected.subscribe((newSelected: LayoutComponent) => {

			this.initializeStuff(newSelected)
		})
	}

	initializeStuff(newSelected: LayoutComponent){

		if(!newSelected) return // Happens sometimes during startup
		this.element = newSelected

		this.variable = "$" + this.element.kebabToCamelCase(this._name)

		let stringValue = this.element && this.name ? (this.element as any)[this.variable] : ""
		if(!stringValue && stringValue != "")
					console.error("There is no variable", this.variable, "in the element", this.element)

		// this.setInitialUnitProperty()

		// this.uiEditorService.dataService.propertiesLoaded.subscribe(() => {

		// 	this.setInitialUnitProperty()
		// })
	}


	element: LayoutComponent
	variable = ""

  @Input() shortName = ""

  public get inputValue(): number { return (this.element as any) ? (this.element as any)[this.variable] : "" }
  public set inputValue(value: number) {

    let stringValue = ""
    if(value) stringValue = value.toString()

    this.uiEditorService.setProperty({
      key: this.name,
      value: stringValue,
      second: this.unit,
      isCss: true,
      renderOnlyOuter: this.renderOnlyOuter
    })
  }

  unit = "px"

  public switchUnitProperty(){

    this.unit=='px'?this.unit='%':this.unit='px'

    this.uiEditorService.setProperty({
      key: this.name,
      value: this.inputValue.toString(),
      second: this.unit,
      isCss: true,
      renderOnlyOuter: this.renderOnlyOuter
    })
  }

  setInitialUnitProperty() {

    let value = this.uiEditorService.selectedObjects[0]?.getPropObj(this.name)?.value
    let second = this.uiEditorService.selectedObjects[0]?.getPropObj(this.name)?.second

    if (second && second != ""){

      this.unit = second
    }
    // prop == undefined || prop.unit == ""
    else if(!this.disabled && value != "-webkit-fill-available") {

      this.uiEditorService.setProperty({
        key: this.name,
        value: this.inputValue.toString(),
        second: this.unit,
				isCss: true,
        renderOnlyOuter: this.renderOnlyOuter
      })
    }
  }
}
