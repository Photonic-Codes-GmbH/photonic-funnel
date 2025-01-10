import { Component, Input } from '@angular/core'
import { Menu } from '../_menu/menu'

@Component({
    selector: 'app-menu-border',
    templateUrl: './menu-border.component.html',
    standalone: false
})
export class MenuBorderComponent extends Menu {

  @Input() width = "100%"

  changeBorderArea(event: string) {
    this.setProp('border-width-area', event, '', false, true)
    this.setBorderWidth()
  }

  changeBorderWidth(event: string) {
    this.setProp('border-single-width', event, '', false, true)
    this.setBorderWidth()
  }

  setBorderWidth() {
    let borderArea = this.getProp('border-width-area')
    let borderSingleWidth = this.getProp('border-single-width')
    let borderWidth = ''
    switch (borderArea) {
      case 'trlb':
        borderWidth = `${borderSingleWidth}px ${borderSingleWidth}px ${borderSingleWidth}px ${borderSingleWidth}px`
        break
      case 'rl':
        borderWidth = `0px ${borderSingleWidth}px 0px ${borderSingleWidth}px`
        break
      case 'tb':
        borderWidth = `${borderSingleWidth}px 0px ${borderSingleWidth}px 0px`
        break
      case 't':
        borderWidth = `${borderSingleWidth}px 0px 0px 0px`
        break
      case 'r':
        borderWidth = `0px ${borderSingleWidth}px 0px 0px`
        break
      case 'b':
        borderWidth = `0px 0px ${borderSingleWidth}px 0px`
        break
      case 'l':
        borderWidth = `0px 0px 0px ${borderSingleWidth}px`
        break
    }

    this.setProp('border-width', borderWidth)
  }

  getSetPropertyValue() {
    if(!this.getProp('border-color')) this.setProp('border-color', '#000000')
    return this.getProp('border-color')
  }
}
