import { Component, HostListener } from '@angular/core'
import { UiEditorService } from '../services/uiEditor.service'
import { TranslationService } from 'src/app/shared/services/translation.service'
import { TranslateService } from '@ngx-translate/core'
import { CommandManagerService } from '../undoRedo/services/commandManager.service'

@Component({
    selector: 'rightSideMenu',
    templateUrl: './rightSideMenu.component.html',
    styleUrls: ['./rightSideMenu.component.scss'],
    standalone: false
})
export class RightSideMenuComponent {

  constructor(
		public uiEditorService: UiEditorService,
		translationService: TranslationService,
		translateService: TranslateService,
		public commandManager: CommandManagerService

	) {

		translationService.initLanguage(translateService).subscribe((newLang: string) => {

			console.log('Changing language to', newLang)
			translateService.use(newLang)
		})
	}

  private _globalStyle: string | undefined
  public get globalStyle(): string | undefined {

    // For performance reasons, get the value from the local variable instead of getProp('xyz')
		const element = this.uiEditorService.selectedObjects[0]
		const variable = "$globalStyle"
		const variableExists = element && ((element as any)[variable] || (element as any)[variable] == "")
    let stringValue = variableExists ? (element as any)[variable] : ""

    this._globalStyle = stringValue == "" ? undefined : stringValue

    return this._globalStyle
  }
  public set globalStyle(value: string | undefined) {

    if(!value) return

    this.uiEditorService.setProperty(
      {key: 'globalStyle', value: value, second: "", isCss: false, renderOnlyOuter: false}
    )
    this._globalStyle = value

		this.uiEditorService.checkIfThisStyleExistsThenApply(value)
  }

	@HostListener('click', ['$event']) onClick(event: MouseEvent) {

		this.removeSyncfusionPopup()
	}

	private removeSyncfusionPopup(){

		// Finde das DIV-Element mit der spezifischen background-color
		var div = document.querySelector('div[style*="background-color: rgba(0, 0, 0, 0.5)"]');

		if (!div) return

		(div as HTMLElement).remove()
		console.log('removed syncfusion popup')
	}

	noRootAndTextFieldFocussed(): boolean {

		return	!this.uiEditorService.rootObjectSelected() && this.noTextFieldFocussed()
	}

	noTextFieldFocussed(): boolean {

		return	!this.uiEditorService.textFieldFocussed &&
						!UiEditorService.monacoEditor?.hasTextFocus() && !UiEditorService.monacoEditor2?.hasTextFocus() //&&
						// !this.uiEditorService.appComponent.elementCodeDialogActive // Not if there is a code dialog open
	}

	/*
██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗    ██╗   ██╗██╗    ███████╗████████╗██╗   ██╗███████╗███████╗
██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝    ██║   ██║██║    ██╔════╝╚══██╔══╝██║   ██║██╔════╝██╔════╝
███████║███████║██╔██╗ ██║██║  ██║██║     █████╗      ██║   ██║██║    ███████╗   ██║   ██║   ██║█████╗  █████╗
██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝      ██║   ██║██║    ╚════██║   ██║   ██║   ██║██╔══╝  ██╔══╝
██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗    ╚██████╔╝██║    ███████║   ██║   ╚██████╔╝██║     ██║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝     ╚═════╝ ╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝

*/
	generatedHTML = ''
	generatedTS = ''
	generatedCSS = ''

	/*
██████╗ ██████╗  ██████╗ ██████╗ ███████╗██████╗ ████████╗██╗███████╗███████╗
██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║██╔════╝██╔════╝
██████╔╝██████╔╝██║   ██║██████╔╝█████╗  ██████╔╝   ██║   ██║█████╗  ███████╗
██╔═══╝ ██╔══██╗██║   ██║██╔═══╝ ██╔══╝  ██╔══██╗   ██║   ██║██╔══╝  ╚════██║
██║     ██║  ██║╚██████╔╝██║     ███████╗██║  ██║   ██║   ██║███████╗███████║
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝╚══════╝╚══════╝

*/
	getProp(key: string) {

		return this.uiEditorService.getProp(key)
	}

	setPropAsHelper(key: string, value: string) {

		this.uiEditorService.setProperty({key: key, value: value, second: '', renderOnlyOuter: false, isCss: false})
	}

	setProp(
		key: string,
		value: string,
		unit?: string,
		renderOnlyOuter?: boolean,
		isCss?: boolean
	) {
		this.uiEditorService.setProperty({
			key: key,
			value: value,
			second: unit ? unit : '',
			renderOnlyOuter: renderOnlyOuter ? renderOnlyOuter : false,
			isCss: isCss ? isCss : false,
		})
	}

}
