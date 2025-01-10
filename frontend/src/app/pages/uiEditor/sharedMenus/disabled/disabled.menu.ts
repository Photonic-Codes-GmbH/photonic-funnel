import { Component } from '@angular/core'
import { Menu } from '../_menu/menu'

@Component({
    selector: 'disabled-menu',
    templateUrl: 'disabled.menu.html',
    standalone: false
})
export class DisabledMenu extends Menu {

  override isCss = false
}
