import { Component } from '@angular/core'

import { Menu } from '../../../sharedMenus/_menu/menu'

@Component({
    selector: 'app-menu-box-shadow',
    templateUrl: './menu-box-shadow.component.html',
    standalone: false
})
export class MenuBoxShadowComponent extends Menu {

  private getValue(index: number): string | undefined {

    const propValue = this.uiEditorService.selectedObjects[0]?.$boxShadow
    if (!propValue) return undefined

    const propValues = propValue.split(' ')
    if (propValues.length < 3) return undefined

    return propValues[index].startsWith('#') ? propValues[index] : propValues[index].slice(0, -2)
  }

  private setValue(index: number, value: string | undefined): void {

    if (!value) return

    const propValue = this.uiEditorService.selectedObjects[0]?.$boxShadow
    let result = '';

    if (propValue) {

      const propValues = propValue.split(' ')
      if (propValues.length < 3) return

      propValues[index] = value.startsWith && value.startsWith('#') ? value : value + 'px'

      if (propValues[0] === '0' && propValues[1] === '0' && propValues[2] === '0' && propValues[3] === '#000000') {

        this.uiEditorService.removeProp('box-shadow')
        return
      }

      result = propValues.join(' ')
    }
		else {

      const tempValue = '0px 0px 0px #000000'
      const propValues = tempValue.split(' ')

      propValues[index] = value.startsWith && value.startsWith('#') ? value : value + 'px'
      result = propValues.join(' ')
    }

    this.uiEditorService.setProperty({ key: 'box-shadow', value: result, second: '', isCss: true, renderOnlyOuter: false });
  }

  public get distanceX(): string | undefined {
    return this.getValue(0);
  }

  public set distanceX(value: string | undefined) {
    this.setValue(0, value);
  }

  public get distanceY(): string | undefined {
    return this.getValue(1);
  }

  public set distanceY(value: string | undefined) {
    this.setValue(1, value);
  }

  public get shadowRadius(): string | undefined {
    return this.getValue(2);
  }

  public set shadowRadius(value: string | undefined) {
    this.setValue(2, value);
  }

  public get shadowColor(): string | undefined {
    return this.getValue(3);
  }

  public set shadowColor(value: string | undefined) {
    this.setValue(3, value);
  }

	setShadow(shadowType: string){

		this.setProp('shadowType', shadowType, '', false, true)

		if(shadowType === 'miniShadow'){

			this.setProp('box-shadow', '0px 0px 2px rgba(0, 0, 0, 0.16)', '', false, false)
			return
		}

		if(shadowType === 'normalShadow'){

			this.setProp('box-shadow', '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.3)', '', false, false)
			return
		}

	}
}
