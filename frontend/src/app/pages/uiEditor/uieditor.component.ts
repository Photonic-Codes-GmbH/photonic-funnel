import { ChangeDetectorRef, Component, HostListener, Renderer2, ViewChild, ViewContainerRef } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { TranslateService } from '@ngx-translate/core'
import { ToastComponent } from '@syncfusion/ej2-angular-notifications'
import { TranslationService } from 'src/app/shared/services/translation.service'
import { UiDownloadService } from './services/uiDownload.service'
import { UiEditorService } from './services/uiEditor.service'
// import { CodeGenerationService } from '../code-generation/code-generation.service'

@Component({
    selector: 'uiEditor',
    templateUrl: './uiEditor.component.html',
    styleUrls: ['./uiEditor.component.scss'],
    standalone: false
})
export class UiEditorComponent {

	constructor(
		public uiEditorService: UiEditorService,
		public readonly changeDetector: ChangeDetectorRef,
		public readonly renderer2: Renderer2,
		public readonly sanitizer: DomSanitizer,
		// public readonly codegenerationService: CodeGenerationService,
		translationService: TranslationService,
		private translateService: TranslateService,
		private uiDownloadService: UiDownloadService,
	) {

		translationService.initLanguage(translateService).subscribe((newLang: string) => {

			console.log('Changing language to', newLang)
			translateService.use(newLang)
		})

		uiEditorService.editorComponent = this
		uiEditorService.changeDetector = changeDetector
	}

	async ngAfterViewInit() {

		// Das muss AfterViewInit stattfinden, weil es auf den viewContainerAnker zugreift
		await this.uiEditorService.initUiEditor()
	}

	@ViewChild('viewContainerAnker', { read: ViewContainerRef })
	viewContainerAnker: ViewContainerRef

	@ViewChild('toasttype') private toastObj: ToastComponent
	public showSuccessToast(title: string, content: string, timeOut = 4000): void {

		this.toastObj.show({
			title: title,
			content: content,
			cssClass: 'e-toast-success',
			icon: 'e-success toast-icons',
			timeOut: timeOut,
			position: { X: 'Right' }
		})
	}
	public showErrorToast(title: string, content: string, timeOut = 4000): void {

		this.toastObj.show({
			title: title,
			content: content,
			cssClass: 'e-toast-danger',
			icon: 'e-error toast-icons',
			timeOut: timeOut,
			position: { X: 'Right' }
		})
	}

	downloadCode() {

		const structure = this.uiEditorService.rootNode.saveLayout
		this.uiDownloadService.generateUI(structure).subscribe((data: any) => {

			if(data && data.html && data.html != "") {

				this.generatedHTML = data.html
				this.generatedTS = data.ts
				this.generatedCSS = data.css
			}
		})
	}

	/*
 ██████╗ ██╗      ██████╗ ██████╗  █████╗ ██╗     ███████╗████████╗██╗   ██╗██╗     ███████╗
██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔══██╗██║     ██╔════╝╚══██╔══╝╚██╗ ██╔╝██║     ██╔════╝
██║  ███╗██║     ██║   ██║██████╔╝███████║██║     ███████╗   ██║    ╚████╔╝ ██║     █████╗  
██║   ██║██║     ██║   ██║██╔══██╗██╔══██║██║     ╚════██║   ██║     ╚██╔╝  ██║     ██╔══╝  
╚██████╔╝███████╗╚██████╔╝██████╔╝██║  ██║███████╗███████║   ██║      ██║   ███████╗███████╗
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚══════╝
	*/
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

	/*
████████╗██╗  ██╗███████╗███╗   ███╗███████╗    ███████╗████████╗██╗   ██╗███████╗███████╗
╚══██╔══╝██║  ██║██╔════╝████╗ ████║██╔════╝    ██╔════╝╚══██╔══╝██║   ██║██╔════╝██╔════╝
   ██║   ███████║█████╗  ██╔████╔██║█████╗      ███████╗   ██║   ██║   ██║█████╗  █████╗  
   ██║   ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══╝      ╚════██║   ██║   ██║   ██║██╔══╝  ██╔══╝  
   ██║   ██║  ██║███████╗██║ ╚═╝ ██║███████╗    ███████║   ██║   ╚██████╔╝██║     ██║     
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝     
	*/

	/**
	 * Sets the Theme Color
	 * @param color For example: #e60505
	 */
	setThemeColor(color: string) {

		this.setProp('theme-color-primary', color)

		// Convert a value like #e60505 to r,g,b
		let r = parseInt(color.slice(1, 3), 16)
		let g = parseInt(color.slice(3, 5), 16)
		let b = parseInt(color.slice(5, 7), 16)

		// Das ist nur für Material. Es soll am Ende so aussehen: --color-sf-primary: 13,110,253;
		document.documentElement.style.setProperty('--color-sf-primary', `${r},${g},${b}`)
	}

	/**
	 * Sets the secondary Theme Color
	 * @param color For example: #e60505
	 */
	setSecondaryThemeColor(color: string) {

		this.setProp('theme-color-secondary', color)

		// Convert a value like #e60505 to r,g,b
		let r = parseInt(color.slice(1, 3), 16)
		let g = parseInt(color.slice(3, 5), 16)
		let b = parseInt(color.slice(5, 7), 16)

		// Das ist nur für Material. Es soll am Ende so aussehen: --color-sf-secondary: 13,110,253;
		document.documentElement.style.setProperty('--color-sf-secondary', `${r},${g},${b}`)
	}

	removePrimaryThemeColor() {

		this.uiEditorService.removeProp('theme-color-primary')
		document.documentElement.style.setProperty('--color-sf-primary', `13,110,253`)
	}

	removeSecondaryThemeColor() {

		this.uiEditorService.removeProp('theme-color-secondary')
		document.documentElement.style.setProperty('--color-sf-secondary', `98, 91, 113`)
	}

	/*
	██████╗ ███████╗ ██████╗ ██╗███████╗████████╗███████╗██████╗     ██╗  ██╗███████╗██╗   ██╗    ███████╗████████╗██████╗  ██████╗ ██╗  ██╗███████╗
	██╔══██╗██╔════╝██╔════╝ ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗    ██║ ██╔╝██╔════╝╚██╗ ██╔╝    ██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗██║ ██╔╝██╔════╝
	██████╔╝█████╗  ██║  ███╗██║███████╗   ██║   █████╗  ██████╔╝    █████╔╝ █████╗   ╚████╔╝     ███████╗   ██║   ██████╔╝██║   ██║█████╔╝ █████╗
	██╔══██╗██╔══╝  ██║   ██║██║╚════██║   ██║   ██╔══╝  ██╔══██╗    ██╔═██╗ ██╔══╝    ╚██╔╝      ╚════██║   ██║   ██╔══██╗██║   ██║██╔═██╗ ██╔══╝
	██║  ██║███████╗╚██████╔╝██║███████║   ██║   ███████╗██║  ██║    ██║  ██╗███████╗   ██║       ███████║   ██║   ██║  ██║╚██████╔╝██║  ██╗███████╗
	╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝   ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝

	*/
	// The root node may not be deleted
	@HostListener('document:keyup', ['$event']) handkeKey(event: KeyboardEvent) {
		let element = event.target

		// if (event.key === 'Delete' && this.noRootAndTextFieldFocussed()) {

		// 	this.uiEditorService.removeAllSelectedElements()
		// }

		// // See if the user pressed ctrl + c
		// if ((event.ctrlKey || event.metaKey) && event.key === 'c' && this.noTextFieldFocussed()
		// ) {

		// 	this.uiEditorService.copySelectedElements()
		// }

		// if ((event.ctrlKey || event.metaKey) && event.key === 'v' && this.noTextFieldFocussed()
		// ) {

		// 	console.log('paste elements')
		// 	this.uiEditorService.pasteElements()
		// }
	}

	noRootAndTextFieldFocussed(): boolean {

		return	!this.uiEditorService.rootObjectSelected() && this.noTextFieldFocussed()
	}

	noTextFieldFocussed(): boolean {

		return	!this.uiEditorService.textFieldFocussed &&
						!UiEditorService.monacoEditor?.hasTextFocus() && !UiEditorService.monacoEditor2?.hasTextFocus() &&
						!this.uiEditorService.selectedObjects[0].element?.isFocused //&& // xSpreadsheet, jodit
						// !this.stateService.appComponent.elementCodeDialogActive // Not if there is a code dialog open
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

	switchCenter() {

		let isActive = this.uiEditorService.hasProp('transform')

		if (isActive) this.uiEditorService.removeProp('transform')
		else {

			this.setProp('left', '50', '%', true)
			this.setProp('top', '50', '%', true)
			this.uiEditorService.removeProp('right')
			this.uiEditorService.removeProp('bottom')
			this.setProp('transform', 'translate(-50%, -50%)', '', true)
		}
	}

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
			isCss: isCss ? isCss : true,
		})
	}
}
