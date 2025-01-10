import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Menu } from '../_menu/menu';

@Component({
    selector: 'dropdown-menu',
    templateUrl: 'dropdown.menu.html',
    standalone: false
})
/**
 * DropdownMenu!
 */
export class DropdownMenu extends Menu {

  @Input() width = "100%"
  @Input() propName = ""
  @Input() propSecondValue = ""
  @Input() labelName = ""
  @Input() dataSource: string[] = []
  @Input() override isCss = false
	@Output() change = new EventEmitter<string>()
}
