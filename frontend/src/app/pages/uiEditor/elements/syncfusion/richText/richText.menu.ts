import { Component, Input } from '@angular/core'
import { Menu } from '../../../sharedMenus/_menu/menu'
import { LayoutComponent } from '../../layout/layout.component'
import { UiEditorService } from '../../../services/uiEditor.service'

@Component({
    selector: 'richTextMenu',
    templateUrl: 'richText.menu.html',
    standalone: false
})
export class SfRichTextMenu extends Menu {

  @Input() override renderOnlyOuter = false
  @Input() override isCss = false

  private _inputValueCode: string | undefined
  public get inputValueCode(): string | undefined {

    this._inputValueCode = this.uiEditorService.selectedObjects[0].element.$code

    return this._inputValueCode
  }
  public set inputValueCode(value: string | undefined) {

    if(!value) return
    this.uiEditorService.selectedObjects.forEach((selectedObject) => {

      selectedObject.element.setCode(value)
    })
    this._inputValueCode = value
  }

  editorOptions1 = {
		theme: 'vs-dark',
		language: 'html',
		automaticLayout: true,
		minimap: {
			enabled: false,
		},
    insertSpaces: false,
	}

	onInit(editor: any, selected: LayoutComponent) {

		UiEditorService.monacoEditor = editor

		// For performance reasons, get the value from the local variable
		const element = this.uiEditorService.selectedObjects[0]

    const code = (element as any)["$code"]
    this.inputValueCode = code
	}
}
