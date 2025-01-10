import { Component } from "@angular/core"
import { UiEditorService } from "../../services/uiEditor.service"
import { TranslateService } from "@ngx-translate/core"
import { TranslationService } from "src/app/shared/services/translation.service"

@Component({
    template: '',
    standalone: false
})
export class Menu {

  constructor(
    public uiEditorService: UiEditorService,
		translationService: TranslationService,
		translateService: TranslateService,
	) {

		translationService.initLanguage(translateService).subscribe((newLang: string) => {

			console.log('Changing language to', newLang)
			translateService.use(newLang)
		})
  }

  // ===========
  // PROPERTIES
  // ===========
  getProp(key: string){

    this.value = this.uiEditorService.getProp(key)
    return this.value
  }

  hasProp(key: string): boolean{

    return this.uiEditorService.hasProp(key)
  }

  renderOnlyOuter = false
  isCss = true
  value: string
  second = ""

  setPropHelper(key: string, value: string){

    this.setProp(key, value, "", false, true)
  }

	/**
	 * ### Sets a property for the currently selected element(s)
	 * @param second is for units like px, em, % etc. or other stuff
	 * @param isCss default is true
	 * @param renderOnlyOuter default is false
	 */
  setProp(key: string, value: string, second?: string, isCss?: boolean, renderOnlyOuter?: boolean){

    this.value = value

    this.uiEditorService.setProperty({
      key: key,
      value: value,
      second: second!=undefined? second : this.second,
      isCss: isCss!=undefined? isCss : this.isCss,
      renderOnlyOuter: renderOnlyOuter!=undefined? renderOnlyOuter : this.renderOnlyOuter,
    })
  }

  /** Nullsafe */
  getPropSecond(key: string){

    let propObj = this.uiEditorService.getPropObj(key)

    if(!propObj) return ""

    this.second = propObj.second

    return this.second
  }

  hasPropSecond(key: string): boolean{

    let propObj = this.uiEditorService.getPropObj(key)?.second

    return propObj&&propObj!=""?true:false
  }

  setPropSecond(key: string, second: string){

    this.second = second

    this.uiEditorService.setProperty({
      key: key,
      value: this.value,
      second: second,
      renderOnlyOuter: this.renderOnlyOuter,
      isCss: this.isCss
    })
  }

  showGeneralApiDialog = false
  closeGeneralApiCallDialog(event: any){

    this.showGeneralApiDialog = false
  }

	getLabelPosition(inputPos: string): "before" | "after" {

    let pos: "before" | "after" = "after"

    switch (inputPos) {
      case "davor":

      pos = "before"
        break;

      case "danach":

      pos = "after"
        break;
    }

    return pos
  }
}
