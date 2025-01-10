import { Component, OnInit } from '@angular/core';
import { Menu } from '../_menu/menu'

@Component({
    selector: 'justifyContentMenu',
    templateUrl: './justifyContent.component.html',
    standalone: false
})
export class JustifyContentComponent extends Menu implements OnInit {

  ngOnInit() {
  }

}
