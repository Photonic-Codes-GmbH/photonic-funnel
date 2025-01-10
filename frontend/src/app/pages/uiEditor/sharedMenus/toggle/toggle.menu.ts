import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Menu } from '../_menu/menu';

@Component({
    selector: 'toggle-menu',
    templateUrl: 'toggle.menu.html',
    standalone: false
})
export class ToggleMenu extends Menu {

  @Input() width = "100%"
  @Input() propName = ""
  @Input() shortName = ""
  @Input() checkedValue = "1"
  @Input() secondValue = "0"
  @Input() override isCss = false
  @Input() override renderOnlyOuter = false
	public checked = false

	@Output() change: EventEmitter<string> = new EventEmitter<string>()
}
