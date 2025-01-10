import { Component, OnInit } from '@angular/core';
import { Menu } from '../_menu/menu'

@Component({
    selector: 'alignItemsMenu',
    templateUrl: './alignItems.component.html',
    standalone: false
})
export class AlignItemsMenuComponent extends Menu implements OnInit {

  ngOnInit() {
  }

}
