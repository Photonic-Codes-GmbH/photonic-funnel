import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { DragAndDropEventArgs, TreeViewComponent } from '@syncfusion/ej2-angular-navigations'
import { LayoutComponent } from '../elements/layout/layout.component'
import { UiEditorService } from '../services/uiEditor.service'

/**
 * # Tree with nested nodes
 */
@Component({
	selector: 'treeAppHierarchy',
	templateUrl: 'treeAppHierarchy.component.html',
	standalone: false
})
export class AppHierarchyTree implements AfterViewInit {

	@ViewChild('treeelement', { static: true }) treeelement: TreeViewComponent
	@ViewChild('treeelement', { static: true }) treeElementRef: ElementRef

	constructor(private uiEditorService: UiEditorService) {

		uiEditorService.tree = this
	}

	async ngAfterViewInit() {

		const style = document.createElement('style')
		style.textContent = ""

		this.uiEditorService.elements.forEach((element) => {

			style.textContent += `
.e-treeview .e-list-icon.${element.type} {

	background-repeat: no-repeat;
	width: 15px;
	height: 15px;
	background-size: 100% 100%;
	background-image: url("../../../../assets/elements/${element.type}.svg");
}
			`
		})

		this.uiEditorService.editorComponent.renderer2.appendChild(document.head, style)
	}

	onDragStop(event: DragAndDropEventArgs) {

		const layout = this.uiEditorService.findElementById(event.droppedNodeData['id']+'')!
		const type = layout.type

		if(event.dropIndicator == "e-drop-in" && type != "layout") event.cancel = true
		else if(event.dropIndicator == "e-drop-next" && !event.dropTarget) event.cancel = true
	}

	onDrop(event: DragAndDropEventArgs) {

		if(event.position == "Inside") this.onDropInside(event)
		else this.onDropOutside(event)
	}

	onDropOutside(event: DragAndDropEventArgs) {

		const newParent = this.uiEditorService.findElementById(event.droppedNodeData['parentID']+'')!
		const droppedAround = this.uiEditorService.findElementById(event.droppedNodeData['id']+'')!
		const movedLayout = this.uiEditorService.findElementById(event.draggedNodeData['id']+'')!

		const dropAfter = event.position == "After"

		this.uiEditorService.moveElementAroundUndo(newParent, droppedAround, movedLayout, dropAfter)
	}

	onDropInside(event: DragAndDropEventArgs) {

		const newParentLayout = this.uiEditorService.findElementById(event.droppedNodeData['id']+'')!
		const movedLayout = this.uiEditorService.findElementById(event.draggedNodeData['id']+'')!

		this.uiEditorService.moveElementIntoUndo(newParentLayout, movedLayout)
	}

	onMouseOver(event: MouseEvent) {

		this.getLayoutComponentFromMouseEvent(event).setHover()
	}

	onMouseOut(event: MouseEvent) {

		this.getLayoutComponentFromMouseEvent(event).removeHover()
	}

	/**
	 * Node selected from the tree
	 * @param event 
	 */
	onNodeSelecting(event: any) {
		
		this.uiEditorService.findElementById(event.nodeData.id)!.onClick()
	}

	public field: Object

	updateDatasourceAndExpand(){

		const sL = (this.uiEditorService.rootNode.saveLayout) as any
		sL.expanded = true

		this.field = {
			dataSource: [sL],
			id: 'id',
			text: 'type',
			child: 'children',
			iconCss: 'type',
		}
	}

	expandTo(newSelected: LayoutComponent){}

	getLayoutComponentFromMouseEvent(event: MouseEvent): LayoutComponent {

		const nodeData = this.treeelement.getNode(this.getRightParentElementFromEvent(event))

		return this.uiEditorService.findElementById(nodeData['id']+'')!
	}

	getRightParentElementFromEvent(event: MouseEvent): HTMLElement {
		
		let parentOfHovered = (event.target as HTMLElement).parentElement
		let nodeData = this.treeelement.getNode(parentOfHovered!)

		if(!nodeData['id']){

			parentOfHovered = parentOfHovered!.parentElement
		}

		return parentOfHovered!
	}


	/**
	 * Node selected from the editor
	 * @param event 
	 */
	onNodeSelectedFromEditor(layout: LayoutComponent) {

		// console.log('onNodeSelectedFromEditor was called with id', layout.id)

		// const element = document.querySelector(`[data-uid="${layout.id}"]`) as HTMLElement
		// const div = element.querySelector('.e-fullrow') as HTMLElement
		// console.log('div is', div)

		// // Koordinaten des Elements abrufen
		// const rect = div.getBoundingClientRect()
		// console.log('rect is', rect)
		// const centerX = rect.left + rect.width / 2
		// const centerY = rect.top + rect.height / 2

		// // Ein Klick-Ereignis an den mittleren Koordinaten des Elements simulieren
		// const clickEvent = new MouseEvent('click', {
		// 	view: window,
		// 	bubbles: true,
		// 	cancelable: true,
		// 	clientX: centerX,
		// 	clientY: centerY,
		// })
		// console.log('clickEvent is', clickEvent)

		// // Markierung hinzufügen
		// const marker = document.createElement('div')
		// marker.style.position = 'absolute'
		// marker.style.left = `${centerX}px`
		// marker.style.top = `${centerY}px`
		// marker.style.width = '10px'
		// marker.style.height = '10px'
		// marker.style.backgroundColor = 'red'
		// marker.style.borderRadius = '50%'
		// marker.style.zIndex = '1000'
		// marker.style.pointerEvents = 'none' // Damit die Markierung keine weiteren Events blockiert

		// document.body.appendChild(marker)

		// Object.defineProperty(clickEvent, 'target', {
		// 	value: div,
		// })

		// // Die Markierung nach kurzer Zeit entfernen
		// setTimeout(() => marker.remove(), 1000)
		
		// // Das Ereignis auf dem Element auslösen
		// const elRef = this.treeElementRef as any
		// console.log('elRef is', elRef)

		// const natEl = elRef.element as HTMLElement
		// console.log('nativeElement is', natEl)
		// console.log('innerHTML is', natEl.innerHTML)

		// natEl.dispatchEvent(clickEvent)
	}
}