import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { LayoutComponent } from '../../layout/layout.component'
import { exportPdf, exportWord, fileManagerSettings, importWord, insertImageSettings, placeholder, quickToolbarSettings, slashMenuSettings, toolbarSettingsModel } from './richTextStuff'

const template = `<button ejs-button [cssClass]="'e-'+$type" [isPrimary]="+$isPrimary == 1">{{$text}}</button>`

@Component({
    selector: 'richText',
    template: `<ng-container #dynamicContainer></ng-container>`,
    standalone: false
})
export class RichTextComponent extends LayoutComponent {

	@ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
	container!: ViewContainerRef

  public constructor(public readonly sanitizer: DomSanitizer) {

    super()
  }

	richTextEditor: any

	async instantiate() {

		const { RichTextEditorComponent } = await import('@syncfusion/ej2-angular-richtexteditor')

		this.container.clear()
		const newComponentRef = this.container.createComponent(RichTextEditorComponent)
		this.richTextEditor = newComponentRef.instance
		const richTextEditor = newComponentRef.instance

		richTextEditor.inlineMode = { enable: true, onSelection: false }
		richTextEditor.toolbarSettings = toolbarSettingsModel
		richTextEditor.insertImageSettings = insertImageSettings
		richTextEditor.showCharCount = false
		richTextEditor.enableXhtml = true
		richTextEditor.fileManagerSettings = fileManagerSettings
		richTextEditor.quickToolbarSettings = quickToolbarSettings
		richTextEditor.enableTabKey = true
		richTextEditor.placeholder = placeholder
		richTextEditor.slashMenuSettings = slashMenuSettings
		richTextEditor.importWord = importWord
		richTextEditor.exportWord = exportWord
		richTextEditor.exportPdf = exportPdf

    if (this.$code === '') {

			this.setCode('<div>Hello World</div>')
		}

		this.subscribeToChanges(newComponentRef)

		// Wird nur ausgelöst, wenn man rausklickt
		// richTextEditor.change.subscribe((args: ChangeEventArgs) => {

		// 	console.log('richTextEditor.change', args)
		// 	this.$code = args.value
		// 	this.content = this.sanitizer.bypassSecurityTrustHtml(this.$code)
		// })
	}

	subscribeToChanges(richTextEditor: ComponentRef<any>) {

		setTimeout(() => {

			const div = richTextEditor.location.nativeElement.querySelector('div.e-content') as HTMLTextAreaElement

			const mutationObserver = new MutationObserver((mutations) => this.$code = div.innerHTML)

			// Observer konfigurieren
			mutationObserver.observe(div, {

				childList: true, // Überwacht Änderungen der Kinder-Elemente
				subtree: true,   // Überwacht Änderungen auch in den Unterelementen
				characterData: true, // Überwacht Textänderungen
			})

		}, 0)
	}

  editor: any
  deselectAllowed = false
  isFocused = false

	private $code = ''
	setCode(value: string) {

		if(this.$code === value) return
		this.$code = value
		this.richTextEditor.value = this.$code
		this.setPropAsHelperUndo('code', this.$code)
	}

  /**
	 * # Listen to focus event
	 * @param event an event containing two properties:
	 * * event - The TinyMCE event object.
	 * * editor - A reference to the editor.
	 */
  public onFocus(event: any) {

		// For the del key. But maybe we need to ignore the richText alltogether
		// For example in a rich text dialog
		this.isFocused = true
  }
	dismissedWarningMessage = false
	warningMessageLoops = 0

  /**
	 * # Listen to blur event
	 * @param event an event containing two properties:
	 * * event - The TinyMCE event object.
	 * * editor - A reference to the editor.
	 */
  public onBlur(event: any) {

		this.isFocused = false
  }

  handleBeingSelected(){

  }

  handleBeingDeSelected(){

  }

  // =================
  // CODE
  // =================
  getCodeTemplate() {
    const template =
``;
    return template
  }

  // =================
  // TEMPLATE STRING
  // =================
  public getHtmlTemplate(tabs?: string): string {

		const template =
`<div class="$displayName">
	$code
</div>`

    return tabs ? tabs + template : template;
  }

}
