import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Menu } from '../_menu/menu'

@Component({
    selector: 'menuButton',
    templateUrl: './menuButton.component.html',
    standalone: false
})
export class MenuButtonComponent extends Menu implements OnInit {

	@Input() text = "Button"
	@Output() click = new EventEmitter()

  ngOnInit() {
  }

}
