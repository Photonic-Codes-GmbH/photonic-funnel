import { Component, EventEmitter, Input } from '@angular/core';
import { Menu } from '../_menu/menu';

@Component({
    selector: 'colorPicker-menu',
    templateUrl: 'colorPicker.menu.html',
    standalone: false
})
export class ColorPickerMenu extends Menu {

  @Input() width = "100%"
  @Input() propName = ""
  @Input() labelName = ""
  @Input() defaultColor: string = "#ffffff"
  @Input() disabled = false
  @Input() override isCss = false
  @Input() override renderOnlyOuter = true

	public change: EventEmitter<string> = new EventEmitter<string>()
}
