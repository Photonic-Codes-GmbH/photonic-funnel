import {Component, Input} from '@angular/core'
import { Menu } from '../../../sharedMenus/_menu/menu'

@Component({
    selector: 'app-menu-background',
    templateUrl: './menu-background.component.html',
    standalone: false
})
export class MenuBackgroundComponent extends Menu {

  @Input() width = "100%"
}
