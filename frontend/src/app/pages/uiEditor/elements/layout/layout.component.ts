import { Component, ComponentRef, HostBinding, HostListener, inject, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core'
import { Property } from '../../model/property'
import { SaveLayout } from '../../model/saveLayout'
import { UiEditorService } from '../../services/uiEditor.service'
import { PropertyChange } from '../../undoRedo/model/changePropertyCommand'
import { CommandManagerService } from '../../undoRedo/services/commandManager.service'
import { ResizeService } from './resizable/resize.service'
import { ResizeHandle, ResizeState } from './resizable/types/resize.types'

/*

         _______________________________________________________
    ()==(                                                      (@==()
         '______________________________________________________'|
           |                                                     |
           |   LAYOUT COMPONENT                                  |
           |   ===============================================   |
           |   * Is an element in the editor                     |
					 |   * Has properties         					               |
					 |   * EditorElement is the logical counterpart,       |
					 |     wich is stored in the database	                 |
           |                                                     |
         __)_____________________________________________________|
    ()==(                                                       (@==()
         '-------------------------------------------------------'

*/

@Component({
    selector: 'app-layout',
    template: `
<ng-container #viewContainerAnker></ng-container>
<resize-handles *ngIf="uiEditorService.isSelected(this) && !uiEditorService.isLiveMode && !isRootNode"
								(handleMouseDown)="onMouseDown($event.event, $event.handle)"></resize-handles>
`,
    standalone: false,
})
export class LayoutComponent implements OnInit {

  public saveLayout: SaveLayout
	componentRef: ComponentRef<LayoutComponent>

	/**
	 * Needed to find this LayoutComponent from the TreeView
	 */
	public id: string

  @ViewChild('viewContainerAnker', { read: ViewContainerRef }) viewContainerAnker: ViewContainerRef

	/*
	██████╗ ███████╗███████╗██╗███████╗██╗███╗   ██╗ ██████╗ 
	██╔══██╗██╔════╝██╔════╝██║╚══███╔╝██║████╗  ██║██╔════╝ 
	██████╔╝█████╗  ███████╗██║  ███╔╝ ██║██╔██╗ ██║██║  ███╗
	██╔══██╗██╔══╝  ╚════██║██║ ███╔╝  ██║██║╚██╗██║██║   ██║
	██║  ██║███████╗███████║██║███████╗██║██║ ╚████║╚██████╔╝
	╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 
	*/
		private resizing = false
		private currentHandle: ResizeHandle | '' = ''
		private startX = 0
		private startY = 0
		private startDimensions: ResizeState
	
		private readonly resizeService = inject(ResizeService)
		private readonly boundMouseMove: (e: MouseEvent) => void
		private readonly boundMouseUp: () => void
	
		ngAfterViewInit() {

			this.nativeElement.style.position = 'relative'
		}
	
		onMouseDown(event: MouseEvent, handle: ResizeHandle): void {
	
			this.resizing = true
			this.currentHandle = handle
			
			// Use client coordinates for tracking mouse movement
			this.startX = event.clientX
			this.startY = event.clientY
	
			// Store current dimensions as starting point
			this.startDimensions = {
				width: +this.nativeElement.style.width.replace('px', ''),
				height: +this.nativeElement.style.height.replace('px', ''),
				top: 0,
				left: 0
			}
	
			// Add event listeners to document to track mouse movement
			document.addEventListener('mousemove', this.boundMouseMove, { capture: true })
			document.addEventListener('mouseup', this.boundMouseUp, { capture: true })
			
			// Prevent text selection while resizing
			document.body.style.userSelect = 'none'
			event.preventDefault()
		}
	
		private onMouseMove(event: MouseEvent): void {
	
			if (!this.resizing) return
	
			const dx = event.clientX - this.startX
			const dy = event.clientY - this.startY
	
			const newDimensions = this.resizeService.calculateNewDimensions(
				this.currentHandle as ResizeHandle,
				this.startDimensions,
				dx,
				dy
			)
	
			this.updateElementState(newDimensions)
			event.preventDefault()
			event.stopPropagation()
		}
	
		private updateElementState(state: ResizeState) {

			this.nativeElement.style.width = state.width + 'px'
			this.nativeElement.style.height = state.height + 'px'
		}
	
		private onMouseUp(): void {
	
			if (!this.resizing) return
	
			document.removeEventListener('mousemove', this.boundMouseMove, { capture: true })
			document.removeEventListener('mouseup', this.boundMouseUp, { capture: true })
			document.body.style.userSelect = ''
			
			// Save the new dimensions
			this.setAndRenderPropUndo({ key: 'width', value: this.nativeElement.style.width.replace('px', ''), second: 'px', renderOnlyOuter: true, isCss: true })
			this.setAndRenderPropUndo({ key: 'height', value: this.nativeElement.style.height.replace('px', ''), second: 'px', renderOnlyOuter: true, isCss: true })

			this.resizing = false
			
			// To prevent a click event after resizing
			this.preventClick = true
			setTimeout(() => this.preventClick = false, 10)
		}
		preventClick = false
	
		ngOnDestroy() {
	
			this.onMouseUp()
		}

	/*
██╗███╗   ██╗██╗████████╗██╗ █████╗ ██╗         ███████╗████████╗██╗   ██╗███████╗███████╗
██║████╗  ██║██║╚══██╔══╝██║██╔══██╗██║         ██╔════╝╚══██╔══╝██║   ██║██╔════╝██╔════╝
██║██╔██╗ ██║██║   ██║   ██║███████║██║         ███████╗   ██║   ██║   ██║█████╗  █████╗
██║██║╚██╗██║██║   ██║   ██║██╔══██║██║         ╚════██║   ██║   ██║   ██║██╔══╝  ██╔══╝
██║██║ ╚████║██║   ██║   ██║██║  ██║███████╗    ███████║   ██║   ╚██████╔╝██║     ██║
╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝
	*/
	uiEditorService: UiEditorService
	renderer: Renderer2
	command: CommandManagerService

  constructor() {

		this.uiEditorService = inject(UiEditorService)
		this.renderer = inject(Renderer2)
		this.command = inject(CommandManagerService)

    if(!this.element) this.element = this
	
		// For resizing
		this.boundMouseMove = this.onMouseMove.bind(this)
		this.boundMouseUp = this.onMouseUp.bind(this)
  }

  public ngOnInit(): void {

		this.uiEditorService.liveModeToggled.subscribe(() => {

			this.setRedOutline()
			if(this.isLayout && this.uiEditorService.isLiveMode) this.renderer.removeClass(this.nativeElement, 'helpLine')
			if(this.isLayout && !this.uiEditorService.isLiveMode) this.renderer.addClass(this.nativeElement, 'helpLine')
		})

		// ist das nicht redundant jetzt, siehe select() im service
		this.uiEditorService.newElementSelected.subscribe(() => this.setRedOutline())

		this.setPropAsHelper('displayName', this.type)

		// Soll für die App sein, aber setzt aktuell die Themecolor für ganz Photonic Lab
		// this.initThemeColor()

		if(!this.isLayout) return

		this.renderer.addClass(this.nativeElement, 'helpLine')

		if(this.uiEditorService.rootNode == this) this.setRedOutline()

		this.setAndRenderProp(new Property('align-items', 'flex-start', '', true, true))

		/*
██████╗ ██████╗  ██████╗ ██████╗ 
██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
██║  ██║██████╔╝██║   ██║██████╔╝
██║  ██║██╔══██╗██║   ██║██╔═══╝
██████╔╝██║  ██║╚██████╔╝██║     
╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     
		*/
		this.nativeElement.addEventListener('dragover', (ev: DragEvent) => {

			const foundLayout = ev ? this.uiEditorService.findByNativeElement(ev.target as HTMLElement) : this
			if(this != foundLayout || this == this.uiEditorService.dragNode) return
			
			ev.preventDefault()
		})

		this.nativeElement.addEventListener('drop', (ev: DragEvent) => this.moveMe(ev))
  }

	/**
	 * Wir befinden uns hier im LayoutComponent des Parents, auf den gedroppt wurde
	 * @param ev The DragEvent from dropping
	 */
	async moveMe(ev?: DragEvent){

		var movedLayout = this.uiEditorService.dragNode
		if(!movedLayout) return
		this.uiEditorService.dragNode = undefined

		this.uiEditorService.moveElementIntoUndo(this, movedLayout)
	}

	/*
████████╗██╗  ██╗███████╗███╗   ███╗███████╗    ███████╗████████╗██╗   ██╗███████╗███████╗
╚══██╔══╝██║  ██║██╔════╝████╗ ████║██╔════╝    ██╔════╝╚══██╔══╝██║   ██║██╔════╝██╔════╝
   ██║   ███████║█████╗  ██╔████╔██║█████╗      ███████╗   ██║   ██║   ██║█████╗  █████╗
   ██║   ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══╝      ╚════██║   ██║   ██║   ██║██╔══╝  ██╔══╝
   ██║   ██║  ██║███████╗██║ ╚═╝ ██║███████╗    ███████║   ██║   ╚██████╔╝██║     ██║
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝
	*/
	$themeColorPrimary: string = "#3b3b3b"
	$themeColorSecondary: string = "#ffffff"

	initThemeColor() {

		if(!this.uiEditorService.rootNode) return

		const primaryColor = this.uiEditorService.rootNode.$themeColorPrimary
		const secondaryColor = this.uiEditorService.rootNode.$themeColorSecondary

		this.setCssVariable(primaryColor, '--color-sf-primary')
		this.setCssVariable(secondaryColor, '--color-sf-secondary')
	}

	setCssVariable(color: string, cssVariable: string) {

		// Convert a value like #e60505 to r,g,b
		let r = parseInt(color.slice(1, 3), 16)
		let g = parseInt(color.slice(3, 5), 16)
		let b = parseInt(color.slice(5, 7), 16)

		document.documentElement.style.setProperty(cssVariable, `${r},${g},${b}`)
	}

/*
██╗   ██╗ █████╗ ██████╗ ███████╗
██║   ██║██╔══██╗██╔══██╗██╔════╝
██║   ██║███████║██████╔╝███████╗
╚██╗ ██╔╝██╔══██║██╔══██╗╚════██║
 ╚████╔╝ ██║  ██║██║  ██║███████║
  ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
*/

/**
 * # DisplayName
 * DisplayName must be unique
 * 
 * DisplayName is used as the name of the css class
 */
	$displayName: string = ""

	$margin: string = ""
	$padding: string = ""
	$marginTop: string = ""
	$marginLeft: string = ""
	$marginRight: string = ""
	$marginBottom: string = ""
	$paddingTop: string = ""
	$paddingLeft: string = ""
	$paddingRight: string = ""
	$paddingBottom: string = ""
	$top: string = ""
	$left: string = ""
	$right: string = ""
	$bottom: string = ""
	$width: string = ""
	$height: string = ""
	$minWidth: string = ""
	$minHeight: string = ""
	$maxWidth: string = ""
	$maxHeight: string = ""
	$ownHeightCss: string = ""
	$spacingSplit: string = ""
	$position: string = ""
	$flexGrow: string = ""
	$overflow: string = ""
	$flexDirection: string = ""
	$flexWrap: string = ""
	$alignContent: string = ""
	$alignItems: string = ""
	$justifyContent: string = ""
	$color: string = ""
	// Theme colors are declare above under "Theme Stuff"
	$themeBackground: string = ""
	$backgroundColor: string = ""
	$backgroundHoverColor: string = ""
	$shadowType: string = ""
	$boxShadow: string = ""
	$borderStyle: string = ""
	$borderRadius: string = ""
	$borderWidthArea: string = ""
	$borderSingleWidth: string = ""
	$gap: string = ""
	$cursor: string = ""
	$pageRoute: string = ""
	$globalStyle: string = ""
	$zIndex: string = ""

	/*
	███████╗███████╗██╗     ███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
	██╔════╝██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
	███████╗█████╗  ██║     █████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║
	╚════██║██╔══╝  ██║     ██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║
	███████║███████╗███████╗███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
	╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
	*/

	/**
	 * Interesting information: the inner element is always clicked first
	 * Then all the parents get clicked, from inner to outer
	 * That means, that the rootNode can reset all the "childHasHover" variables
	 */
	@HostListener('click', ['$event']) onClick(event?: MouseEvent) {

		if (this.resizing || this.preventClick) return

		let select = true
		
		let target = event?.target as HTMLElement
		let foundLayout = event ? this.uiEditorService.findByNativeElement(target) : this
		if(!foundLayout) foundLayout = this.uiEditorService.findByNativeElement(target.parentElement as HTMLElement)
		
		if(this != foundLayout) return

		// Unselect
		if(this.uiEditorService.elementInFormulaMode) select = false
		if(target && target.getAttribute("DeSelectOff") != null && this.hasRedOutline) select = false

		if(!select) return

		if(event && event.ctrlKey) this.uiEditorService.addSelected(this)
		else this.uiEditorService.checkAndSetSelectedUndo(this)
	}

	// For performance reasons, hostBindings should not call methods
	@HostBinding('class.red-outline') hasRedOutline: boolean = false

	/**
	 * Set the red outline if the element is selected
	 * and not in live mode
	 */
	setRedOutline() {

		this.hasRedOutline = this.uiEditorService.isSelected(this) && !this.uiEditorService.isLiveMode
	}

	/*
	██╗  ██╗ ██████╗ ██╗   ██╗███████╗██████╗     ███████╗████████╗██╗   ██╗███████╗███████╗
	██║  ██║██╔═══██╗██║   ██║██╔════╝██╔══██╗    ██╔════╝╚══██╔══╝██║   ██║██╔════╝██╔════╝
	███████║██║   ██║██║   ██║█████╗  ██████╔╝    ███████╗   ██║   ██║   ██║█████╗  █████╗
	██╔══██║██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗    ╚════██║   ██║   ██║   ██║██╔══╝  ██╔══╝
	██║  ██║╚██████╔╝ ╚████╔╝ ███████╗██║  ██║    ███████║   ██║   ╚██████╔╝██║     ██║
	╚═╝  ╚═╝ ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝

	*/

	// For performance reasons, hostBindings should not call methods
	@HostBinding('class.blue-outline') hasBlueOutline: boolean = false

	/**
	 * Interesting information: the inner element is always called first
	 * Then all the parents get a mouseover event and call this, from inner to outer
	 * That means, that the rootNode can reset all the "childHasHover" variables
	 * Dieses Event feuert tatsächlich nur einmalig, wenn der Mauszeiger über das Element geht, nicht ständig
	 */
	@HostListener('mouseover', ['$event']) setHover(event?: MouseEvent) {

		const foundLayout = event ? this.uiEditorService.findByNativeElement(event.target as HTMLElement) : this

		if(this != foundLayout) return

		const oldHoverElement = this.uiEditorService.hoveredElement
		oldHoverElement ? oldHoverElement.hasBlueOutline = false : null
		oldHoverElement ? oldHoverElement.setHoverBackgroundColor(false) : null

		this.uiEditorService.hoveredElement = foundLayout!

		if(!this.uiEditorService.isLiveMode) this.hasBlueOutline = true
		this.setHoverBackgroundColor(true)
	}

	@HostListener('mouseleave') removeHover() {

		this.hasBlueOutline = false
		this.setHoverBackgroundColor(false)
	}

	/**
	 * This is to set the hover background color
	 */
	setHoverBackgroundColor(activate: boolean) {

    if (this.$backgroundHoverColor == '') return

    if (activate){

			let bgColor = this.hexToRgba(this.$backgroundHoverColor)
			this.renderer.setStyle(this.nativeElement, 'background-color', bgColor)
		}

		else this.renderer.setStyle(this.nativeElement, 'background-color', 'white')
  }

	/*
██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ ███████╗
██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗██╔════╝
███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝███████╗
██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║
██║  ██║███████╗███████╗██║     ███████╗██║  ██║███████║
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝

	*/

  /** Says if this is an element or a layout wich can have children */
	@HostBinding('class.layout')
	isLayout = true // This is a layout by default, but can be overwritten by the child

	/**
	 * The specific class object for example SfButtonComponent
	 */
  element: any
  parent: LayoutComponent
  children: LayoutComponent[] = []

	/**
	 * The type of the component as defined in leftSideMenu.component.html
	 */
  type: string

	/**
	 * The nativeElement is the HTMLElement of the component
	 */
  nativeElement: HTMLElement

	/**
	 * Specifies if this is the rootNode of the editor
	 */
  isRootNode = false

  adjustInnerDimensionsIfNotLayout() {

    if(this.isLayout) return

    let child = this.nativeElement.children[0] as HTMLElement

    if(!child) return

    this.renderer.setStyle(child, 'height', "100%")
    this.renderer.setStyle(child, 'width', "-webkit-fill-available")

    let parentHeight = this.nativeElement.offsetHeight
    let childHeight = child.offsetHeight

    if(childHeight > parentHeight){

      let diff = childHeight - parentHeight
      this.renderer.setStyle(child, 'height', (this.nativeElement.offsetHeight-diff)+"px")
    }
  }

  hexToRgba(hex: string): string | null {

		// Must accept #c62929 and #c62929ff
    const queryResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex)

    if (!queryResult) { return null; }

    const red = parseInt(queryResult[1], 16)
    const green = parseInt(queryResult[2], 16)
    const blue = parseInt(queryResult[3], 16)
    const alpha = queryResult[4] ? parseInt(queryResult[4], 16) : 1

    const rgba = `rgba(${red},${green},${blue},${alpha})`
    return rgba
  }

/*
██████╗ ██████╗  ██████╗ ██████╗ ███████╗██████╗ ████████╗██╗███████╗███████╗
██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║██╔════╝██╔════╝
██████╔╝██████╔╝██║   ██║██████╔╝█████╗  ██████╔╝   ██║   ██║█████╗  ███████╗
██╔═══╝ ██╔══██╗██║   ██║██╔═══╝ ██╔══╝  ██╔══██╗   ██║   ██║██╔══╝  ╚════██║
██║     ██║  ██║╚██████╔╝██║     ███████╗██║  ██║   ██║   ██║███████╗███████║
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝╚══════╝╚══════╝

*/

  /*
   * ███████╗███████╗████████╗    ██████╗ ██████╗  ██████╗ ██████╗
   * ██╔════╝██╔════╝╚══██╔══╝    ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
   * ███████╗█████╗     ██║       ██████╔╝██████╔╝██║   ██║██████╔╝
   * ╚════██║██╔══╝     ██║       ██╔═══╝ ██╔══██╗██║   ██║██╔═══╝
   * ███████║███████╗   ██║       ██║     ██║  ██║╚██████╔╝██║
   * ╚══════╝╚══════╝   ╚═╝       ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝
   */
  /** Sets css properties, helper properties and displayName */
  public setAndRenderPropUndo(dangerousPropObj: Property) {

		const isNewValue = this.getProp(dangerousPropObj.key) !== dangerousPropObj.value
		if(!isNewValue) return

		// Make sure it can be undone - must be done before the prop is changed, weil sonst getPropObj falsch ist
		this.command.push(new PropertyChange(this.id, this.getPropObj(dangerousPropObj.key), dangerousPropObj, this.uiEditorService))

		this.setAndRenderProp(dangerousPropObj)
  }
	
  public setAndRenderProp(dangerousPropObj: Property) {

		// Clone the prop
		let newPropObj = (JSON.parse(JSON.stringify(dangerousPropObj)) as Property)
		
		// Create or update prop in the saveLayout
		const props = this.saveLayout.properties
    if (!this.hasProp(newPropObj.key)) props.push(newPropObj)
		else props[props.findIndex(prop => prop.key === newPropObj.key)] = newPropObj

    if (newPropObj.key === 'displayName') this.handleDisplayname(newPropObj)

		// Set the local variable
		const varName = '$' + this.kebabToCamelCase(newPropObj.key)
		this.element[varName] = newPropObj.value

		if (newPropObj.isCss) this.renderProp(newPropObj)

		// Persist the changes ⚠️ Warning: make sure, that the id of the savelayout is correct
		// this.stateService.propertiesService.createOrUpdate(newPropObj)

		// Tell everybody!
    this.uiEditorService.onPropSet.emit(this.saveLayout)
  }

	renderProp(newPropObj: Property){

    // NativeElement should be there to be able to style
    if (!this.nativeElement) return

		// If this is a layout, or if this is a renderOnlyOuter style,
		// then only the outer tag get's the style
		newPropObj.renderOnlyOuter = newPropObj.renderOnlyOuter || this.isLayout

		// Style the outer or the inner tag
		this.renderer.setStyle(newPropObj.renderOnlyOuter ?
																this.nativeElement: // The outer tag
																this.nativeElement.children[0] ? this.nativeElement.children[0] : this.nativeElement, // The inner tag if present, else the outer tag
														newPropObj.key, newPropObj.value + (newPropObj.second ? newPropObj.second : ''))

    this.adjustInnerDimensionsIfNotLayout()

    // When a child tag is absolute, the parent must be relative
    // Unsauber, kann bestende Parent Position überschreiben
    if(newPropObj.key === 'position' && newPropObj.value === 'absolute') this.parent?.setAndRenderPropUndo({
      key: 'position',
      value: 'relative',
      second: '',
      renderOnlyOuter: false,
      isCss: true
    })
    if(newPropObj.key === 'position' && newPropObj.value === 'static') this.parent?.removeProp('position')
	}

	/** ⚠️ ATTENTION: This is only for css props, because they are not used in html generation.
	 *  All Helper-Props must be in camelCase already.
	 *
	 * Convert kebab-case to camelCase
	 * @param str
	 * @returns
	 */
	kebabToCamelCase(str: string) {

		return str.replace(/-./g, match => match[1].toUpperCase())
	}

  setPropAsHelperUndo(key: string, value: string) {

    this.setAndRenderPropUndo({ key: key, value: value, second: '', isCss: false, renderOnlyOuter: false })
  }

  setPropAsHelper(key: string, value: string) {

    this.setAndRenderProp({ key: key, value: value, second: '', isCss: false, renderOnlyOuter: false })
  }

  handleDisplayname(newPropObj: Property){

    // See if this displayName already exists
    // If yes, add a higher number to the end
    let foundElements = this.uiEditorService.findElementsByName(newPropObj.value)
    let i = foundElements.length
    while(foundElements.length > 1){

      newPropObj.value = newPropObj.value + i
      foundElements = this.uiEditorService.findElementsByName(newPropObj.value)
      i++
    }

    // Set the id of the element
    this.nativeElement.id = newPropObj.value
  }

	/*
 ██████╗ ███████╗████████╗        ██╗    ██╗  ██╗ █████╗ ███████╗    ██████╗ ██████╗  ██████╗ ██████╗
██╔════╝ ██╔════╝╚══██╔══╝       ██╔╝    ██║  ██║██╔══██╗██╔════╝    ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
██║  ███╗█████╗     ██║         ██╔╝     ███████║███████║███████╗    ██████╔╝██████╔╝██║   ██║██████╔╝
██║   ██║██╔══╝     ██║        ██╔╝      ██╔══██║██╔══██║╚════██║    ██╔═══╝ ██╔══██╗██║   ██║██╔═══╝
╚██████╔╝███████╗   ██║       ██╔╝       ██║  ██║██║  ██║███████║    ██║     ██║  ██║╚██████╔╝██║
 ╚═════╝ ╚══════╝   ╚═╝       ╚═╝        ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝
	*/

  /** @returns Prop Value NULLSAFE */
  public getProp(key: string): string {

    const value = this.getPropObj(key)?.value
    return value ? value : ''
  }

  public getPropObj(key: string): Property | undefined {

		if(!this.saveLayout.properties) this.saveLayout.properties = []
    return this.saveLayout.properties.find(prop => prop.key === key)
  }

  public hasProp(key: string): boolean {

		if(!this.saveLayout.properties) this.saveLayout.properties = []
    return this.saveLayout.properties.find(prop => prop.key === key) !== undefined
  }

	/*
██████╗ ███████╗███╗   ███╗ ██████╗ ██╗   ██╗███████╗    ██████╗ ██████╗  ██████╗ ██████╗
██╔══██╗██╔════╝████╗ ████║██╔═══██╗██║   ██║██╔════╝    ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
██████╔╝█████╗  ██╔████╔██║██║   ██║██║   ██║█████╗      ██████╔╝██████╔╝██║   ██║██████╔╝
██╔══██╗██╔══╝  ██║╚██╔╝██║██║   ██║╚██╗ ██╔╝██╔══╝      ██╔═══╝ ██╔══██╗██║   ██║██╔═══╝
██║  ██║███████╗██║ ╚═╝ ██║╚██████╔╝ ╚████╔╝ ███████╗    ██║     ██║  ██║╚██████╔╝██║
╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝   ╚═══╝  ╚══════╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝
	*/
  removeProp(key: string) {

    let prop = this.getPropObj(key)
    if(!prop) return

		if(!this.saveLayout.properties) return

    this.saveLayout.properties.splice(this.saveLayout.properties.findIndex(prop => prop.key == key), 1)

    if(prop.isCss){

      prop.renderOnlyOuter = prop.renderOnlyOuter || this.isLayout
      let myElement = prop.renderOnlyOuter ? this.nativeElement : this.nativeElement.children[0]
      if(myElement) this.renderer.removeStyle(myElement, key)
    }

    this.adjustInnerDimensionsIfNotLayout()

		// Set the local variable
		const varName = '$' + key
		this.element[varName] = ''

		// Persist the changes
		// this.stateService.propertiesService.delete(prop)
		// this.dataService.deleteProp(this.saveElement, prop)
  }

  /*
   * ██████╗ ███████╗███╗   ███╗ ██████╗ ██╗   ██╗███████╗    ████████╗██╗  ██╗██╗███████╗
   * ██╔══██╗██╔════╝████╗ ████║██╔═══██╗██║   ██║██╔════╝    ╚══██╔══╝██║  ██║██║██╔════╝
   * ██████╔╝█████╗  ██╔████╔██║██║   ██║██║   ██║█████╗         ██║   ███████║██║███████╗
   * ██╔══██╗██╔══╝  ██║╚██╔╝██║██║   ██║╚██╗ ██╔╝██╔══╝         ██║   ██╔══██║██║╚════██║
   * ██║  ██║███████╗██║ ╚═╝ ██║╚██████╔╝ ╚████╔╝ ███████╗       ██║   ██║  ██║██║███████║
   * ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝   ╚═══╝  ╚══════╝       ╚═╝   ╚═╝  ╚═╝╚═╝╚══════╝
   */

	/**
	 * # Delete LayoutComponent
	 * The purpose of this is to remove, then persist
	 * 
	 * Whereas ```removeMe()``` only removes
	 */
  public deleteMe() {

    this.removeMe()

    // Persist the changes
		// this.stateService.editorElementsService.delete(this.saveLayout)
  }

  private removeMe() {

		// Remove from parent LayoutComponent children
		const pChildren = this.parent.children
		pChildren.splice(pChildren.findIndex((item: LayoutComponent) => item === this), 1)

		// Remove from parents SaveLayout children
		const spChildren = this.parent.saveLayout.children
		spChildren.splice(spChildren.findIndex((item: SaveLayout) => item === this.saveLayout), 1)

		this.children.forEach(child => {

			child.removeMe()
		})

    this.isLayout = true
    this.element = undefined

		// Find this in the parents viewContainerAnker
	  const myIndex = this.parent.viewContainerAnker.indexOf(this.componentRef.hostView)
		this.parent.viewContainerAnker.detach(myIndex)

    this.nativeElement.remove()
    this.type = "removed"
    this.children = []

    this.uiEditorService.select(this.uiEditorService.rootNode)
		this.uiEditorService.tree.updateDatasourceAndExpand()
  }
}
