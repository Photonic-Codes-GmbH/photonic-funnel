import { Component, Input } from '@angular/core'
import { Menu } from '../../sharedMenus/_menu/menu'
import { LayoutComponent } from '../layout/layout.component'
import { UiEditorService } from '../../services/uiEditor.service'

@Component({
    selector: 'customCode-menu',
    templateUrl: 'customCode.menu.html',
    styleUrls: ['customCode.menu.scss'],
    standalone: false
})
export class CustomCodeComponentMenu extends Menu {

  @Input() override renderOnlyOuter = false
  @Input() isHelper = true

  private _inputValueHTML: string | undefined
  public get inputValueHTML(): string | undefined {

    this._inputValueHTML = this.uiEditorService.selectedObjects[0].element.htmlToShow

    return this._inputValueHTML
  }
  public set inputValueHTML(value: string | undefined) {

		if(value === undefined) return
    this.uiEditorService.selectedObjects.forEach((selectedObject) => {

      selectedObject.element.htmlToShow = value
    })
    this._inputValueHTML = value
  }

  private _inputValueStyle: string | undefined
  public get inputValueStyle(): string | undefined {

    this._inputValueStyle = this.uiEditorService.selectedObjects[0].element.styleToShow

    return this._inputValueStyle
  }
  public set inputValueStyle(value: string | undefined) {

		if(value === undefined) return
    this.uiEditorService.selectedObjects.forEach((selectedObject) => {

      selectedObject.element.styleToShow = value
    })
    this._inputValueStyle = value
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

  editorOptions2 = {
		theme: 'vs-dark',
		language: 'css',
		automaticLayout: true,
		minimap: {
			enabled: false,
		},
    insertSpaces: false,
	}

	onInit(editor: any, selected: LayoutComponent) {

		UiEditorService.monacoEditor = editor
    const code = this.getProp(`html`)
    this.inputValueHTML = code
	}

	onInit2(editor: any, selected: LayoutComponent) {

		UiEditorService.monacoEditor2 = editor
	}
}
