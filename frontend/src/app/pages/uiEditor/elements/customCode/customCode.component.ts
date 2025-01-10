import { AfterViewInit, Component, ElementRef, SimpleChanges, ViewChild } from '@angular/core'
import { LayoutComponent } from '../layout/layout.component'

@Component({
    selector: 'app-customCode',
    template: '<div #htmlContainer></div>',
    standalone: false
})
export class CustomCodeComponent extends LayoutComponent implements AfterViewInit {

  public constructor()
	{

    super()

    /*
      This is needed, because formula.directive.ts calls
      this.elementService.elementInFormulaMode.element.deactivateFormulaMode()
      in onClick()
    */
		this.element = this
  }

	override ngAfterViewInit(){

    super.ngAfterViewInit()

    /*
      This is needed, because the Properties are done loading after the View Init Hook
    */
    // this.uiEditorService.propertiesAreLoaded ? this.init() :
    //   this.uiEditorService.propertiesLoaded.subscribe(() => {

        this.init()
      // })
  }

  init(){

    if(this.getProp("html") == "")
							this.setAndRenderProp({key:"html",
														value: "<div class='hello'>Hello world!</div>",
														second: "", isCss: false, renderOnlyOuter: false})
    // if(this.getProp("style") == "")
		// 					this.setProp({key:"style",
		// 												value: ".hello{ font-style: italic; color: green; }",
		// 												second: "", isTailwind: false, isHelper: true, renderOnlyOuter: false})
    //

		this.renderHtmlContent()

    this.uiEditorService.changeDetector.detectChanges()
  }

  @ViewChild('htmlContainer') htmlContainer: ElementRef
  renderHtmlContent() {

		this.renderer.setProperty(this.htmlContainer.nativeElement, 'innerHTML', '')

    const htmlContent = "<div>" + this.getProp("html") + "<style>" + this.getProp("style") + "</style></div>"
    const div = this.renderer.createElement('div')
    this.renderer.setProperty(div, 'innerHTML', htmlContent)
    const htmlContentElement = div.firstChild
    this.renderer.appendChild(this.htmlContainer.nativeElement, htmlContentElement)
  }

  public get htmlToShow(): string { return this.getProp("html") }
  public set htmlToShow(value: string) {

    this.setAndRenderPropUndo(
      {key: 'html', value: value, second: "", isCss: false, renderOnlyOuter: false}
    )

		this.renderHtmlContent()
  }

  public get styleToShow(): string { return this.getProp("style") }
  public set styleToShow(value: string) {

    this.setAndRenderPropUndo(
      {key: 'style', value: value, second: "", isCss: false, renderOnlyOuter: false}
    )

		this.renderHtmlContent()
  }

  ngOnChanges(changes: SimpleChanges) {

    this.uiEditorService.changeDetector.detectChanges()
  }

  public getCssTemplate(): string {

    return this.getProp('style') ? this.getProp('style') + "\n\n" : ""
  }

  public getHtmlTemplate(): string {

    return this.getProp('html')
  }
}
