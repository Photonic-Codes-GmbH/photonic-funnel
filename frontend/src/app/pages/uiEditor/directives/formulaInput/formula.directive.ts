import { Directive, ElementRef, HostBinding, Input } from '@angular/core'
import { LayoutComponent } from '../../elements/layout/layout.component'
import { UiEditorService } from '../../services/uiEditor.service'

/*

         _______________________________________________________
    ()==(                                                      (@==()
         '______________________________________________________'|
           |                                                     |
           |   Formula Directive                                 |
           |   ===============================================   |
           |                                                     |
           |   Attach this to any <ejs-textbox> to activate   |
           |   formula capabilities!                             |
           |                                                     |
           |                                                     |
         __)_____________________________________________________|
    ()==(                                                       (@==()
         '-------------------------------------------------------'

*/

@Directive({
    selector: '[formula]',
    standalone: false
})
export class FormulaDirective {

  constructor(
    private uiEditorService: UiEditorService,
    private hostRef: ElementRef,
  ) {
    this.host = this.hostRef.nativeElement

    /*
      We need this because of the case that something else in the app is setting my formula prop,
      for example after starting the app, then we need to set this.formula with it and render the formula.
      My first attemt was to implement this in the getter of inputValue, but then the app crashed.
    */
    // uiEditorService.dataService.propertiesLoaded.subscribe((prop) => {

    //   this._formula = this.user.getProp(this.name)
    //   this.activateOrDeactivateFormulaMode()
    //   this.convertFormulaToTextAndRender()
    // })
  }

  /**
   * The component, wich is affected by this
   */
  @Input() user: LayoutComponent

  name: string

  host: HTMLElement
  input: HTMLInputElement | HTMLTextAreaElement | null
  label: HTMLElement | null
  normalLabeltext: string = ""
  formulaLabeltext: string = "FORMEL MODUS AKTIVIERT"
  ngAfterViewInit(): void {

    if(!this.user) this.user = this.uiEditorService.selectedObjects[0]

    this.host = this.hostRef.nativeElement

    // Get <label> from the host
    this.label = this.host.querySelector('label')

    // Store the current text of the label in normalLabeltext
    this.normalLabeltext = this.label?.textContent || ""
    /*
      This is correct for normal Elements
      But if we are in a dialog, it is later overwritten with input.id + "Formula"
    */
    this.name = this.user.getProp("displayName") + "FormulaFor" + this.normalLabeltext

    // Get <input> or <textarea> from the host
    this.input = this.host.querySelector('input') || this.host.querySelector('textarea')
    if(!this.input) return
    this.formulaLabeltext += " für " + this.name

    let isAFormula = this.user.getProp(this.name).startsWith("=")
    this._formula = isAFormula ? this.user.getProp(this.name) : ""

    // Subscribe to (focus) event of the this.input
    this.input?.addEventListener('focus', () => {

      this.activateOrDeactivateFormulaMode()
      this.convertFormulaToTextAndRender()
    })

    // Subscribe to (input) event of the this.input (only for formula mode)
    this.input?.addEventListener('input', (event) => {

      // Must be first, because initially, the user must be able to activate it through typing "="
      this.activateOrDeactivateFormulaMode()
      if(!this.isInFormulaMode) return

      this.input ? this.formula = this.input.value : ""
      if(this.isInFormulaMode) this.convertFormulaToTextAndRender()
    })

    /*
      Initial formula rendering
    */
    this.input.value = this.user.getProp(this.name)
    /*
     I tried to use AfterViewInit, but it was still too early
     and the element I needed was not yet rendered.
    */
    this.waitForMySelectedField()

    listenToClicks(this.uiEditorService)

    this.uiEditorService.changeDetector.detectChanges()
  }

  private _formula: string = ""
  public get formula(): string {

    return this._formula
  }
  public set formula(value: string) {

    if(value == undefined || value == null) return
    this._formula = value

    if(this.isInFormulaMode && this.input) this.input.value = value

    this.user.setAndRenderPropUndo(
      { key: this.name, value: value, second: "", isCss: false, renderOnlyOuter: false }
    )
  }

  waitForMySelectedField(){

    setTimeout(() => {

      this.convertFormulaToTextAndRender()
    }
    , 50)
  }

  @HostBinding('style.outline') get getoutline(){

    return this.isInFormulaMode ? 'blue solid 2px' : ''
  }

  textToShow: string
  isInFormulaMode = false

  activateOrDeactivateFormulaMode(){

    if(!this.input) return

    if( this.uiEditorService.isSelected(this.user) &&
        (this.input.value.startsWith("=") || this.formula.startsWith("=")) &&
        !this.isInFormulaMode &&
        this.uiEditorService.textFieldFocussed){

      this.activateFormulaMode()
    }
    else if(this.isInFormulaMode && (
            !this.uiEditorService.isSelected(this.user) ||
            !this.input.value.startsWith("=") ||
            this.input.value == "")){

      if(this.input.value == "" || !this.input.value.startsWith("=")) this.formula = ""
      // Can also be deactivated from listenToClicks()
      this.deactivateFormulaMode()
    }
  }

  /**
   * Activates the formula mode for this element.
   * Can also be called from text.menu.ts
   */
  activateFormulaMode(){

    this.isInFormulaMode = true
    this.uiEditorService.elementInFormulaMode = this
    if(this.input){

      if(!this.formula) this._formula = this.input.value
      this.input.value = this._formula
    }
    if(this.label) this.label.innerText = this.formulaLabeltext
  }

  deactivateFormulaMode(){

    this.isInFormulaMode = false
    this.uiEditorService.elementInFormulaMode = undefined
    if(this.input && this.textToShow){

      this.convertFormulaToTextAndRender()
      this.textToShow ? this.input.value = this.textToShow : ""
      this.input.dispatchEvent(new Event('input'))
    }
    if(this.label) this.label.innerText = this.normalLabeltext
  }

  convertFormulaToTextAndRender(){

    if(!this.input) return

    // Get all entered element names in the input.value, for example 'elementName'A1
    let nameAndCell = /'[\w\.\|-]*'[A-Z]*\d*/g
    let matches = this.input.value.match(nameAndCell)

    this.textToShow = this.input.value.replace("=", "")
    if (!matches) return // There are no selected elements

    let resettedTableStyles = false
    // Iterate over all entered element names
    matches.forEach(elementWithCell => {

      // Get the element name -> remove the cell that is potentially there
      let elementId = elementWithCell.substring(1).split("'")[0]

      // Get the cell part, for example "A1" -> remove the element name
      let cellString = elementWithCell.substring(1).split("'")[1]

      // Get the element's value
      const element = document.getElementById(elementId) as HTMLElement

      if(!element) return

      let value: string | null = ""
      if(element.tagName == "TABLE" && cellString){

        if(!resettedTableStyles) this.resetTableStyles(element as HTMLTableElement)
        resettedTableStyles = true
        value = this.getCellValue(element, cellString)
      }
      else if(element.tagName == "INPUT") value = (element as HTMLInputElement).value
      else value = element.innerText

      this.textToShow = this.textToShow.replace(elementWithCell, value? value : "")
    })
  }

  resetTableStyles(table: HTMLTableElement) {

    for(let i = 0; i < table.rows.length; i++){

      for(let j = 0; j < table.rows[i].cells.length; j++){

        removeCellStyle(table.rows[i].cells[j])
      }
    }
  }

  /**
   * Gets the value of a cell in a table.
   * @param table The table to get the cell value from
   * @param cellNotation The cell notation, e.g. A1, B2, C3
   * @returns The innerText of the cell
   */
  getCellValue(table: HTMLElement, cellNotation: string): string {

    // Konvertiert den Buchstaben in der Zellenbezeichnung in eine Spaltennummer.
    let colLetters = cellNotation.match(/[A-Z]+/)
    let rowNumbers = cellNotation.match(/\d+/)

    if(!colLetters || !rowNumbers) return ""

    let colLetter = colLetters[0]
    let colNumber = colLetter.split('').reduce((result, letter) => {

        return result * 26 + letter.charCodeAt(0) - 'A'.charCodeAt(0) + 1
    }, 0)

    // Konvertiert die Zahl in der Zellenbezeichnung in eine Zeilennummer.
    let rowNumber = parseInt(rowNumbers[0])

    // Gibt den Zelleninhalt an der berechneten Position zurück.
    let cell = (table as HTMLTableElement).rows[rowNumber].cells[colNumber - 1]

    if(this.isInFormulaMode) styleCell(cell, this.uiEditorService)
    let cellText = cell.innerText
    return cellText ? cellText : ""
  }

  public getColor(selectedColor: string): any{//ThemePalette {

    // let color: ThemePalette = 'primary'
    // switch (selectedColor) {

    //   case 'primary':
    //     color = 'primary'
    //     break
    //   case 'accent':
    //     color = 'accent'
    //     break
    //   case 'warn':
    //     color = 'warn'
    //     break
    //   default:
    //     color = undefined;
    //     break
    // }

    // return color
  }
}
/* ================= End of FormulaDirective Class ================= */

let alreadyRegistered = false
let thiz: FormulaDirective | undefined
function listenToClicks(uiEditorService: UiEditorService){

  if(!alreadyRegistered){

    alreadyRegistered = true
    document.addEventListener('click', (event) => {

      thiz = uiEditorService.elementInFormulaMode
      if(!thiz) return

      let clickedTarget = event.target as HTMLElement
      const editingArea = uiEditorService.rootNode.nativeElement
      let id = clickedTarget.id ? clickedTarget.id : findId(clickedTarget)
      const formulaSelection = id && clickedTarget != thiz.input

      if(formulaSelection){

        let isTableCell = clickedTarget.tagName == "TD"
        let newValue = ""
        if(!isTableCell) newValue = "'"+id+"'"
        if(isTableCell){

          styleCell(clickedTarget as HTMLTableCellElement)
          newValue = "'"+id+"'"+getCellInformation(clickedTarget)
        }
        thiz!.formula = thiz!.formula + newValue
      }
      else if(!editingArea.contains(clickedTarget) && thiz &&
                                    !uiEditorService.textFieldFocussed && !id){

        thiz.convertFormulaToTextAndRender()
        thiz.deactivateFormulaMode()
      }
    })
  }
}

function findId(clickedTarget: HTMLElement) {

  // Go through the parents until we find an id
  while(!clickedTarget.id && clickedTarget.parentElement){

    clickedTarget = clickedTarget.parentElement

    // Stop if we reach the root node (just in case)
    if(clickedTarget == document.body) break
  }

  return clickedTarget.id
}

function getCellInformation(clickedTarget: HTMLElement): string {

  let table = clickedTarget.closest('table')
  if(!table) return ""
  let rowIndex = clickedTarget.closest('tr')?.rowIndex
  let colIndex = clickedTarget.closest('td')?.cellIndex
  if(rowIndex == undefined || colIndex == undefined) return ""

  let excelColumn = convertNumberToExcelColumnLetters(colIndex+1)

  let clickedCellAddress = excelColumn+""+rowIndex
  return clickedCellAddress
}

/**
 * Give the cell a dashed border in a random dark color and the same color in light as
 * backround color
 * @param rowIndex The Index of the row. Warning: Starts with 0!
 * @param colIndex The Index of the column. Warning: Starts with 0!
 * @param text The text of the cell
 */
function styleCell(cell: HTMLTableCellElement, uiEditorService?: UiEditorService) {

  if(!thiz) thiz = uiEditorService?.elementInFormulaMode
  if(!thiz) return

  let randomColor = getRandomColor()
  thiz.user.renderer.setStyle(cell, "border", "dashed 2px "+randomColor)
  thiz.user.renderer.setStyle(cell, "background-color", randomColor+"1f")
}

function removeCellStyle(cell: HTMLTableCellElement, uiEditorService?: UiEditorService) {

  if(!thiz) thiz = uiEditorService?.elementInFormulaMode
  if(!thiz) return

  thiz.user.renderer.setStyle(cell, "border", "")
  thiz.user.renderer.setStyle(cell, "background-color", "")
}

/**
 * Converts a number to excel column letters.
 * @param column Starts with 1.
 * @returns A = 1, B = 2, C = 3, ...
 */
function convertNumberToExcelColumnLetters(column: number): string {

  let columnName = ''
  while (column > 0) {

      const modulo = (column - 1) % 26
      columnName = String.fromCharCode(65 + modulo) + columnName
      column = Math.floor((column - modulo) / 26)
  }
  return columnName
}

function getRandomColor(): string {

  let letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {

      color += letters[Math.floor(Math.random() * 16)]
  }

  // Dunkle Farbe erstellen
  let r = parseInt(color.slice(1, 3), 16)
  let g = parseInt(color.slice(3, 5), 16)
  let b = parseInt(color.slice(5, 7), 16)
  let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000

  if (yiq >= 128) return getRandomColor() // Wenn die Farbe zu hell ist
  else return color
}
