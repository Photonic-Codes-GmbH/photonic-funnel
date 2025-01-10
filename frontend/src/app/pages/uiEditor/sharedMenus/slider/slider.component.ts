import { Component, EventEmitter, Input, Output } from '@angular/core'

import { Menu } from '../_menu/menu'

@Component({
    selector: 'sliderMenu',
    templateUrl: './slider.component.html',
    standalone: false
})
export class MenuSliderComponent extends Menu {

  @Input() public width: string = '100%'
  @Input() public name: string = ''
  @Input() public label: string = 'Slider'
  @Input() public override isCss = true
  @Input() public override renderOnlyOuter = false
  @Input() public min: number
  @Input() public max: number
  @Input() public step: number
	@Output() change = new EventEmitter<string>()

  public get inputValue(): string | undefined {

    const value = this.uiEditorService.getProp(this.name)
    return value === '' ? undefined : value
  }

	@Input()
  public set inputValue(value: string | undefined) {

    if (!value) return
    this.uiEditorService.setProperty({	key: this.name, value: value, second: this.second, isCss: true,
																		renderOnlyOuter: false })
		this.change.emit(value)
  }
}
