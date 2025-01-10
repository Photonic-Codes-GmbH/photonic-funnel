import { ChangeDetectorRef, ComponentRef, EventEmitter, Injectable, Type, ViewContainerRef } from '@angular/core'
import { Toast } from '@syncfusion/ej2-notifications'
import { FormulaDirective } from '../directives/formulaInput/formula.directive'
import { CustomCodeComponent } from '../elements/customCode/customCode.component'
import { LayoutComponent } from '../elements/layout/layout.component'
import { ButtonComponent } from '../elements/syncfusion/button/button.component'
import { RichTextComponent } from '../elements/syncfusion/richText/richText.component'
import { Property } from '../model/property'
import { SaveLayout } from '../model/saveLayout'
import { UiEditorComponent } from '../uieditor.component'
import { ElementSelection } from '../undoRedo/model/elementSelectionCommand'
import { CommandManagerService } from '../undoRedo/services/commandManager.service'
import { CreationDeletion } from '../undoRedo/model/elementCreationDeletionCommand'
import { AppHierarchyTree } from '../tree-app-hierarchy/treeAppHierarchy.component'
import { MoveInto } from '../undoRedo/model/moveIntoCommand'
import { MoveAround } from '../undoRedo/model/moveAroundCommand'
import { TranslateService } from '@ngx-translate/core'

/*

         _______________________________________________________
    ()==(                                                      (@==()
         '______________________________________________________'|
           |                                                     |
           |   UI EDITOR SERVICE                                 |
           |   ===============================================   |
           |   * Manages the elements in the editor              |
					 |     * CREATE NEW ELEMENTS    					             |
					 |     * FIND ELEMENTS    					                   |
					 |     * SELECTED ELEMENTS    					               |
					 |     * REMOVE / CLONE ELEMENTS				               |
					 |     * Responsible for bottom left tree hierarchy    |
           |                                                     |
         __)_____________________________________________________|
    ()==(                                                       (@==()
         '-------------------------------------------------------'

*/

@Injectable()
export class UiEditorService {

	public componentMap: Map<string, Type<unknown>> = new Map<string, Type<unknown>>()

	commands: CommandManagerService

	// Auch verwendet in leftSideMenu.component.html
	public elements: {type: string, class: Type<unknown>}[] =
	[
		{type: 'layout',			class: LayoutComponent},
		{type: 'customCode',	class: CustomCodeComponent},
		{type: 'sf-button',		class: ButtonComponent},
		{type: 'richText',		class: RichTextComponent}
	]
	public constructor(private translate: TranslateService) {

		this.elements.forEach(async element => {
			
			this.componentMap.set(element.type, element.class)
		})
	}

	globalStylesToApply: string[] = []
	static monacoEditor: any // Stores the current monaco editor, to see if it's focussed in editor.component.ts
	static monacoEditor2: any // Stores the current monaco editor, to see if it's focussed in editor.component.ts
  public editorComponent: UiEditorComponent
	public changeDetector: ChangeDetectorRef
  public rootNode: LayoutComponent
  public dragNode: LayoutComponent | undefined
  public selectedObjects: LayoutComponent[] = []
  public tree: AppHierarchyTree

  public textFieldFocussed = false
	hoveredElement: LayoutComponent

  public elementInFormulaMode: FormulaDirective | undefined

  public isLiveMode = false
	public previewType: 'desktop' | 'tablet' | 'smartphone' = 'desktop'
	liveModeToggled: EventEmitter<boolean> = new EventEmitter<boolean>()
	// Called from uieditor.component.html
	public toggleLiveMode() {

		this.rootNode.nativeElement.click()
		this.isLiveMode = !this.isLiveMode
		this.liveModeToggled.emit(this.isLiveMode)

		if(!this.isLiveMode) this.switchPreviewMode('desktop')
	}

	// Called from uieditor.component.html
	public switchPreviewMode(type: 'desktop' | 'tablet' | 'smartphone') {

		this.previewType = type

		const editorArea = document.getElementById('editor-area')
		editorArea!.className = 'editor-area ' + type
	}

	/*
██╗███╗   ██╗██╗████████╗
██║████╗  ██║██║╚══██╔══╝
██║██╔██╗ ██║██║   ██║
██║██║╚██╗██║██║   ██║
██║██║ ╚████║██║   ██║
╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝
	*/
	async initUiEditor() {

		this.selectedObjects = []

		if(this.rootNode){

			const saveLayout = this.rootNode.saveLayout;
			(this.rootNode as unknown) = undefined
			await this.renderRecursive(undefined, saveLayout)
		}
		else{

			await this.renderRecursive(undefined, new SaveLayout())
		}

		this.tree?.updateDatasourceAndExpand()
	}

/*
 ██████╗██╗   ██╗████████╗     ██████╗ ██████╗ ██████╗ ██╗   ██╗    ██████╗  █████╗ ███████╗████████╗███████╗
██╔════╝██║   ██║╚══██╔══╝    ██╔════╝██╔═══██╗██╔══██╗╚██╗ ██╔╝    ██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔════╝
██║     ██║   ██║   ██║       ██║     ██║   ██║██████╔╝ ╚████╔╝     ██████╔╝███████║███████╗   ██║   █████╗  
██║     ██║   ██║   ██║       ██║     ██║   ██║██╔═══╝   ╚██╔╝      ██╔═══╝ ██╔══██║╚════██║   ██║   ██╔══╝  
╚██████╗╚██████╔╝   ██║▄█╗    ╚██████╗╚██████╔╝██║        ██║▄█╗    ██║     ██║  ██║███████║   ██║   ███████╗
 ╚═════╝ ╚═════╝    ╚═╝╚═╝     ╚═════╝ ╚═════╝ ╚═╝        ╚═╝╚═╝    ╚═╝     ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝
*/
	public cutUndo(){

		this.copy()
		this.removeAllSelectedElementsUndo()
	}

	/**
	 * Copies the current selected element's saveLayout to the clipboard
	 */
	public copy(){

		const selected = this.selectedObjects[0]
		const saveLayout = selected.saveLayout.getClone()
		navigator.clipboard.writeText(JSON.stringify(saveLayout))

		this.translate.get('Kopiert').subscribe((title: string) => {
			this.translate.get('Kopiert_long').subscribe((content: string) => {
	
				this.editorComponent.showSuccessToast(title, selected.type + " " + content)
			})
		})
	}

	/**
	 * Pastes the saveLayout from the clipboard into the selected element
	 */
	public pasteUndo(){

		navigator.clipboard.readText().then(async text => {

			const saveLayout = JSON.parse(text)
			await this.cloneUndo(this.selectedObjects[0], saveLayout)
			
			this.tree?.updateDatasourceAndExpand()
		})
	}

  /*
 ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗       ██╗        ██████╗██╗      ██████╗ ███╗   ██╗███████╗
██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝       ██║       ██╔════╝██║     ██╔═══██╗████╗  ██║██╔════╝
██║     ██████╔╝█████╗  ███████║   ██║   █████╗      ████████╗    ██║     ██║     ██║   ██║██╔██╗ ██║█████╗  
██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝      ██╔═██╔═╝    ██║     ██║     ██║   ██║██║╚██╗██║██╔══╝  
╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗    ██████║      ╚██████╗███████╗╚██████╔╝██║ ╚████║███████╗
 ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═════╝       ╚═════╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
   */
	/**
	 * ### Create a new element as a user
	 * SaveLayout has to be created and assigned to everyone
	 * This may not be called from the system, but only from the user
	 * Why? Because the user will do it only once, and the system on every startup
	 * This is to make sure, that initial Properties are only set one time when the user creates this
	 * @param type An optional element type. If not given, a layout element will be created.
	 * @returns
	 */
	public async createElementsIntoAllSelectedUndo(type?: string) {

		for (const parentObj of this.selectedObjects) {

			// Create the new element in the UI
			const newElement = await this.createAndRenderFromType(parentObj, type)

			// Make sure it can be undone
			this.commands.push(new CreationDeletion(parentObj.id, undefined, undefined, newElement.saveLayout, this))
		}
	}

	/**
	 * # Create Element into parent
	 * The purpose of this is to have an alternative way to create new element without undo
	 * 
	 * ⚠️ **Attention**: Currently, is doesn't set the existing saveLayout props because it's for **new** elements.
	 * 
	 * To set the existing saveLayout props, use ```clone()```
	 * @param parentId The parent element to create the new element into
	 * @param type 
	 */
	public async createIntoParentFromSaveLayout(parentId: string, saveLayout: SaveLayout, index?: number) {

		const parent = this.findElementById(parentId)!
		await this.createAndRenderFromSavelayout(parent, saveLayout, index)
	}

	private async createAndRenderFromType(parentObj: LayoutComponent, type?: string) {

		const saveLayout = new SaveLayout(type)

		return this.createAndRenderFromSavelayout(parentObj, saveLayout)
	}

	private async createAndRenderFromSavelayout(parentObj: LayoutComponent, saveLayout: SaveLayout, index?: number) {

		// Create the new element in the UI
		const newElement = await this.renderSingleElement(parentObj, saveLayout)
		parentObj.saveLayout.children.push(newElement.saveLayout)

		if(index == 0 || index) this.moveElementToIndex(parentObj, index, newElement)

		this.tree?.updateDatasourceAndExpand()

		return newElement
	}

	/**
	 * Called from uieditor.component.html for cloning the selected element
	 */
  public async cloneAllUndo() {

		for (const selectedObject of this.selectedObjects) {

			// Wir müssen eine neue ID vergeben
			const cloneSaveLayout = selectedObject.saveLayout.getClone()
			const parent = selectedObject.parent

			this.cloneUndo(parent, cloneSaveLayout)
    }
		
		this.tree?.updateDatasourceAndExpand()
  }

  private async cloneUndo(parent: LayoutComponent, cloneSaveLayout: SaveLayout) {

		const clone = await this.clone(parent, cloneSaveLayout)

		// Make sure it can be undone
		this.commands.push(new CreationDeletion(parent.id, undefined, undefined, clone.saveLayout, this))
  }

  async clone(parent: LayoutComponent, cloneSaveLayout: SaveLayout, index?: number) {

		const clone = await this.renderRecursive(parent, cloneSaveLayout)

		parent.saveLayout.children.push(cloneSaveLayout)

		if(index == 0 || index) this.moveElementToIndex(parent, index, clone)

		return clone
  }

	/*
██████╗ ███████╗███╗   ██╗██████╗ ███████╗██████╗     ███████╗██╗  ██╗██╗███████╗████████╗██╗███╗   ██╗ ██████╗ 
██╔══██╗██╔════╝████╗  ██║██╔══██╗██╔════╝██╔══██╗    ██╔════╝╚██╗██╔╝██║██╔════╝╚══██╔══╝██║████╗  ██║██╔════╝ 
██████╔╝█████╗  ██╔██╗ ██║██║  ██║█████╗  ██████╔╝    █████╗   ╚███╔╝ ██║███████╗   ██║   ██║██╔██╗ ██║██║  ███╗
██╔══██╗██╔══╝  ██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗    ██╔══╝   ██╔██╗ ██║╚════██║   ██║   ██║██║╚██╗██║██║   ██║
██║  ██║███████╗██║ ╚████║██████╔╝███████╗██║  ██║    ███████╗██╔╝ ██╗██║███████║   ██║   ██║██║ ╚████║╚██████╔╝
╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
	*/
	/**
	 * ### Recursive element loading from system
	 * from the SaveLayout object. -> saveLayouts are all defined already.
	 * 1. Creates an element for the given SaveLayout
	 * 2. Sets the props for the element
	 * 3. Repeat for all children of the element
	 *
	 * ⚠️ Attention: This does not add the generated elements into the parent object.
	 * That is done in renderSingleElement()
	 *
	 * @param parent The parent element to load the child into
	 * @param saveLayout The element to load
	 * @returns The loaded element as LayoutComponent
	 */
	private async renderRecursive(parent: LayoutComponent | undefined, saveLayout: SaveLayout): Promise<LayoutComponent> {

		let instance: LayoutComponent

		/**
		 * We clone this because new components may initialize themselves with props and overwrite it in the saveLayout
		 */
		const cloneOfProps = JSON.parse(JSON.stringify(saveLayout.properties))

		if (!this.rootNode) instance = await this.createAndRenderRootElement(saveLayout)
		else instance = await this.renderSingleElement(parent!, saveLayout)

		// Load properties
		cloneOfProps.forEach((property: Property) => {

			instance.setAndRenderProp(property)
		})

		// Load children
		for (const child of saveLayout.children) {

			await this.renderRecursive(instance, child)
		}

		return instance
	}

	private async createAndRenderRootElement(saveLayout: SaveLayout): Promise<LayoutComponent> {

		const renderContainer = this.editorComponent.viewContainerAnker
		const newComponent = renderContainer.createComponent(LayoutComponent)
		const newRoot = newComponent.instance

		newRoot.saveLayout = saveLayout
		newRoot.id = saveLayout.id
		newRoot.isLayout = newRoot.saveLayout.isLayout
		newRoot.nativeElement = newComponent.location.nativeElement
		newRoot.type = 'App'

		// Note: The displayName prop will be set in the ngOnInit() of layout.component.ts

		newRoot.isRootNode = true
		this.rootNode = newRoot
		this.select(newRoot)
		this.rootNode.setRedOutline()

		this.changeDetector.detectChanges()

		// This seems to happen after we route away from the uiEditor and back
		const myRenderContainer =  await this.waitForViewContainerAnker(this.rootNode) as ViewContainerRef

		return newRoot
	}

	async waitForViewContainerAnker(parent: LayoutComponent) {

		let counter = 0
	
		while (!parent.viewContainerAnker) {

			if (counter >= 25) console.log('Parent Element is:', parent)
			if (counter >= 25) return console.error('Timeout: viewContainerAnker konnte nicht gefunden werden')
	
			counter++
			await new Promise(resolve => setTimeout(resolve, 100))
		}
	
		return parent.viewContainerAnker
	}


	/**
	 * ### Instantiates and renders a new element into the given parent object
	 * May not change any saveLayout. That has to be done in the calling function.
	 * @param parentObj LayoutComponent
	 * @param saveLayout The SaveLayout to create from
	 * @param type An optional element type. If not given, a layout element will be created.
	 */
	private async renderSingleElement(parentObj: LayoutComponent, saveLayout: SaveLayout): Promise<LayoutComponent> {

		const type = saveLayout.type
		const isLayout = type == 'layout'

		// This seems to happen after we drop a saveLayout with children into another element
		const renderContainer = await this.waitForViewContainerAnker(parentObj) as ViewContainerRef

		let newComponentRef: ComponentRef<any>
		if (isLayout) newComponentRef = renderContainer.createComponent(LayoutComponent)
		else newComponentRef = renderContainer.createComponent((this.componentMap.get(type) as Type<unknown>))

		const newComponent = newComponentRef.instance
		newComponent.saveLayout = saveLayout
		newComponent.id = saveLayout.id
		newComponent.componentRef = newComponentRef
		newComponent.nativeElement = newComponentRef.location.nativeElement
		newComponent.type = type
		newComponent.isLayout = isLayout
		newComponent.parent = parentObj
		parentObj.children.push(newComponent)

		if(newComponent.element.instantiate) await newComponent.element.instantiate()

		return newComponent
	}

	/*
███╗   ███╗ ██████╗ ██╗   ██╗███████╗
████╗ ████║██╔═══██╗██║   ██║██╔════╝
██╔████╔██║██║   ██║██║   ██║█████╗  
██║╚██╔╝██║██║   ██║╚██╗ ██╔╝██╔══╝  
██║ ╚═╝ ██║╚██████╔╝ ╚████╔╝ ███████╗
╚═╝     ╚═╝ ╚═════╝   ╚═══╝  ╚══════╝
	*/
	/**
	 * ### Remove the moved element from the old parent
	 * @param movedLayout The LayoutComponent to move
	 */
	removeFromOldParent(movedLayout: LayoutComponent) {

		// Remove from old Parent LayoutComponent children
		const oldParent = movedLayout.parent
		const oldIndex = oldParent.children.indexOf(movedLayout)
		oldParent.children.splice(oldIndex, 1)

		// Remove from old Parent SaveLayout children
		const oldParentSL = movedLayout.parent.saveLayout
		oldParentSL.children.splice(oldIndex, 1)

		// Remove from old Parent hostView.
		oldParent.viewContainerAnker.detach(oldIndex)

		return oldIndex
	}

	/**
	 * # Move a LayoutComponent into a layout
	 * The moved element will be placed at the end of the children
	 * @param newParent The new parent LayoutComponent
	 * @param movedLayout The LayoutComponent to move
	 */
	moveElementIntoUndo(newParent: LayoutComponent, movedLayout: LayoutComponent) {

		const oldParent = movedLayout.parent
		const oldIndex = oldParent.children.indexOf(movedLayout)

		this.moveElementInto(newParent, movedLayout)
		
		this.commands.push(new MoveInto(oldParent.id, oldIndex, newParent.id, movedLayout.id, this))
	}

	moveElementInto(newParent: LayoutComponent, movedLayout: LayoutComponent) {

		this.removeFromOldParent(movedLayout)

		newParent.children.push(movedLayout)
		newParent.saveLayout.children.push(movedLayout.saveLayout)
		newParent.viewContainerAnker.insert(movedLayout.componentRef.hostView)
		
		this.lastSteps(newParent, movedLayout)
	}

	/**
	 * # Move a LayoutComponent before or after another LayoutComponent
	 * This can be under the same parent or under another parent
	 * @param newParent The new parent LayoutComponent
	 * @param droppedAround The LayoutComponent to drop around - before or after
	 * @param movedLayout The LayoutComponent to move
	 * @param after If true, the movedLayout will be placed after the droppedAround element, otherwise before
	 */
	moveElementAroundUndo(newParent: LayoutComponent, droppedAround: LayoutComponent, movedLayout: LayoutComponent, after: boolean) {

		const oldParent = movedLayout.parent
		const oldIndex = oldParent.children.indexOf(movedLayout)

		this.moveElementAround(newParent, droppedAround, movedLayout, after)
		
		this.commands.push(new MoveAround(oldParent.id, oldIndex, droppedAround.id, newParent.id, movedLayout.id, after, this))
	}

	moveElementAround(newParent: LayoutComponent, droppedAround: LayoutComponent, movedLayout: LayoutComponent, after: boolean) {

		this.removeFromOldParent(movedLayout)

		// Place into new Parent LayoutComponent children
		let droppedIndex = newParent.children.findIndex((item: LayoutComponent) => item === droppedAround)
		let leftSide = newParent.children.slice(0, droppedIndex)
		let rightSide = newParent.children.slice(droppedIndex + 1)
		newParent.children = after ?
			[...leftSide, droppedAround, movedLayout, ...rightSide] :
			[...leftSide, movedLayout, droppedAround, ...rightSide]
		
		// Place into new Parent SaveLayout children
		droppedIndex = newParent.saveLayout.children.findIndex((item: SaveLayout) => item === droppedAround.saveLayout)
		let leftSideSL = newParent.saveLayout.children.slice(0, droppedIndex)
		let rightSideSL = newParent.saveLayout.children.slice(droppedIndex + 1)
		newParent.saveLayout.children = after ?
			[...leftSideSL, droppedAround.saveLayout, movedLayout.saveLayout, ...rightSideSL] :
			[...leftSideSL, movedLayout.saveLayout, droppedAround.saveLayout, ...rightSideSL]

		// Place into new Parent hostView
		const droppedAroundIndex = newParent.viewContainerAnker.indexOf(droppedAround.componentRef.hostView)
		after ? newParent.viewContainerAnker.insert(movedLayout.componentRef.hostView, droppedAroundIndex + 1) :
						newParent.viewContainerAnker.insert(movedLayout.componentRef.hostView, droppedAroundIndex)
		//
		
		this.lastSteps(newParent, movedLayout)
	}

	/**
	 * # Move a LayoutComponent to a specific index of a new parent
	 * In the current version it may not trigger a new undo command, because it is used as "undo" for the moveInto command
	 * @param newParent The new parent LayoutComponent
	 * @param index The index to move the element to
	 * @param movedLayout The LayoutComponent to move
	 */
	moveElementToIndex(newParent: LayoutComponent, index: number, movedLayout: LayoutComponent) {

		this.removeFromOldParent(movedLayout)

		// Place into new Parent LayoutComponent children
		let leftSide = newParent.children.slice(0, index)
		let rightSide = newParent.children.slice(index)
		newParent.children = [...leftSide, movedLayout, ...rightSide]
		
		// Place into new Parent SaveLayout children
		let leftSideSL = newParent.saveLayout.children.slice(0, index) // exclude index
		let rightSideSL = newParent.saveLayout.children.slice(index) // include index
		newParent.saveLayout.children = [...leftSideSL, movedLayout.saveLayout, ...rightSideSL]

		// Place into new Parent hostView
		newParent.viewContainerAnker.insert(movedLayout.componentRef.hostView, index)
		
		this.lastSteps(newParent, movedLayout)
	}

	lastSteps(newParent: LayoutComponent, movedLayout: LayoutComponent) {
		
		movedLayout.parent = newParent
		this.select(movedLayout)
		this.tree.updateDatasourceAndExpand()
	}

  /*
   * ███████╗    ██╗    ███╗   ██╗    ██████╗
   * ██╔════╝    ██║    ████╗  ██║    ██╔══██╗
   * █████╗      ██║    ██╔██╗ ██║    ██║  ██║
   * ██╔══╝      ██║    ██║╚██╗██║    ██║  ██║
   * ██║         ██║    ██║ ╚████║    ██████╔╝
   * ╚═╝         ╚═╝    ╚═╝  ╚═══╝    ╚═════╝
   */

  public foundElements: LayoutComponent[] = []

	public findElementsByName(name: string) {

		this.foundElements = []

		let stack: LayoutComponent[] = [ this.rootNode ]

		while (stack.length > 0) {

			const child = stack.pop()!

			if (child.$displayName === name) this.foundElements.push(child)

			if (child.children) stack = [ ...stack, ...child.children ]
		}

		return this.foundElements
	}

	public findElementById(id: string): LayoutComponent | undefined {

		this.foundElements = []

		let stack: LayoutComponent[] = [ this.rootNode ]

		while (stack.length > 0) {

			const child = stack.pop()!

			if (child.id === id) return child

			if (child.children) stack = [ ...stack, ...child.children ]
		}

		return undefined
	}

	public findByNativeElement(element: HTMLElement): LayoutComponent | undefined {
		
		this.foundElements = []
		let stack: LayoutComponent[] = [ this.rootNode ]

		while (stack.length > 0) {

			const child = stack.pop()!
			if (child.nativeElement === element) return child
			if (child.children) stack = [ ...stack, ...child.children ]
		}

		// We end up here, if nothing was found previously
		// Then we look for the parent element
		stack = [ this.rootNode ]
		while (stack.length > 0) {

			const child = stack.pop()!
			if (child.nativeElement === element.parentElement) return child
			if (child.children) stack = [ ...stack, ...child.children ]
		}

		return undefined
	}

	/**
	 * ### Find elements by global style
	 * Looks for elements with the given global style
	 * @param globalStyle The name of the global style to search
	 * @returns The found elements
	 */
	public findElementsByGlobalStyle(globalStyle: string) {

		this.foundElements = []

		let stack: LayoutComponent[] = [ this.rootNode ]

		while (stack.length > 0) {

			const child = stack.pop()!
			if (child.getProp('globalStyle').includes(globalStyle)) this.foundElements.push(child)

			if (child.children) stack = [ ...stack, ...child.children ]
		}

		return this.foundElements
	}

/*
███████╗███████╗██╗     ███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
██╔════╝██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
███████╗█████╗  ██║     █████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║
╚════██║██╔══╝  ██║     ██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║
███████║███████╗███████╗███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
*/
	tfFocussed(isFocussed: boolean){

		this.textFieldFocussed = isFocussed
	}

	newElementSelected: EventEmitter<LayoutComponent> = new EventEmitter<LayoutComponent>()

	/**
	 * ### Selects an element
	 * * deselects the old one(s)
	 * * pushes it to the selectedObjects array
	 *
	 * @param newSelected The new element to select
	 */
  checkAndSetSelectedUndo(newSelected: LayoutComponent) {

    // A single element was selected
    let oldSelected = this.selectedObjects[0]
    let wasSingle = this.selectedObjects.length == 1

    let hasElement = newSelected.element != undefined
    let hasDeselectAllowed = hasElement && newSelected.element.deselectAllowed != undefined
    let deselectAllowed = hasElement && hasDeselectAllowed ? newSelected.element.deselectAllowed : true
    let sameSelected = wasSingle && oldSelected == newSelected

    if(sameSelected && !deselectAllowed) return

    // Same selected -> select rootNode
    if (sameSelected && deselectAllowed) newSelected = this.rootNode

    this.select(newSelected)
		this.tree.onNodeSelectedFromEditor(newSelected)
		
		// Make sure it can be undone
		if(oldSelected != newSelected) this.commands.push(new ElementSelection(oldSelected.id, newSelected.id, this))
  }

	deselectAllOld() {
		
    let oldSelected = this.selectedObjects[0]
		this.removeDragIcon(oldSelected)
		this.selectedObjects.forEach(object => {

			object.element?.handleBeingDeSelected ? object.element.handleBeingDeSelected() : ''
		})

		this.selectedObjects = []
	}

	select(newSelected: LayoutComponent) {

    this.deselectAllOld()

		this.selectedObjects.push(newSelected)
		newSelected.element?.handleBeingSelected ? newSelected.element.handleBeingSelected() : ''
		this.tree?.expandTo(newSelected)
		this.setAllOfType(newSelected.type)

		this.renderDragIcon(newSelected)
		newSelected.setRedOutline()
		this.newElementSelected.emit(newSelected)
	}

  addSelected(newSelected: LayoutComponent){

    let objs = this.selectedObjects
    let index = objs.indexOf(newSelected)
    if(index > -1) objs.splice(index, 1)
    else {
			
			objs.push(newSelected)
			this.newElementSelected.emit(newSelected)
		}
		this.setAllOfType(newSelected.type)
  }

  isSelected(thisOne: LayoutComponent) {

    return this.selectedObjects.indexOf(thisOne) > -1
  }
/*
██████╗ ██████╗  █████╗  ██████╗ 
██╔══██╗██╔══██╗██╔══██╗██╔════╝ 
██║  ██║██████╔╝███████║██║  ███╗
██║  ██║██╔══██╗██╔══██║██║   ██║
██████╔╝██║  ██║██║  ██║╚██████╔╝
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ 
*/

	renderDragIcon(newSelected: LayoutComponent){

		if(newSelected == this.rootNode) return
		const element = newSelected.nativeElement

		element.style.position = 'relative'

		const icon = getDragIcon()
		icon.addEventListener('dragstart', (ev: DragEvent) => this.dragNode = newSelected)
		element.appendChild(icon)
	}

	removeDragIcon(deSelected: LayoutComponent){

		if(!deSelected) return
		const selectableElement = deSelected.nativeElement
		
		const icon = document.getElementById('drag1')

		if (icon && selectableElement.contains(icon)) selectableElement.removeChild(icon)
	}

/*
██████╗ ██████╗  ██████╗ ██████╗ ███████╗██████╗ ████████╗██╗   ██╗    ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ██╗███╗   ██╗ ██████╗
██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝╚██╗ ██╔╝    ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██║████╗  ██║██╔════╝
██████╔╝██████╔╝██║   ██║██████╔╝█████╗  ██████╔╝   ██║    ╚████╔╝     ███████║███████║██╔██╗ ██║██║  ██║██║     ██║██╔██╗ ██║██║  ███╗
██╔═══╝ ██╔══██╗██║   ██║██╔═══╝ ██╔══╝  ██╔══██╗   ██║     ╚██╔╝      ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██║██║╚██╗██║██║   ██║
██║     ██║  ██║╚██████╔╝██║     ███████╗██║  ██║   ██║      ██║       ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗██║██║ ╚████║╚██████╔╝
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝      ╚═╝       ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝

*/

  /**
	 * I care about all the selected ones!
	 */
  setProp(key: string, value: string) {

    this.setProperty(new Property(key, value, '', true, false))
  }

  /**
	 * I care about all the selected ones!
	 * @param prop The property to set
	 */
  setProperty(prop: Property) {

    // Happens in the beginning before the rootNode is there
    if (!this.selectedObjects[0]) return

    this.selectedObjects.forEach(layoutComponent => {

      layoutComponent.setAndRenderPropUndo(prop)
    })

    this.changeDetector.detectChanges()
  }

  public onPropSet: EventEmitter<SaveLayout> = new EventEmitter<SaveLayout>()

  /**
   * Retrieves a property value for a single element
   * YES ONLY FOR THE FIRST[0]
   *
   * @param key The key name of the property
   * @returns The VALUE nullsafe
   */
  getProp(key: string) {

    if(!this.selectedObjects[0]) return ''

    return this.selectedObjects[0].getProp(key)
  }

  getPropObj(key: string) {

    if(!this.selectedObjects[0]) return

    return this.selectedObjects[0].getPropObj(key)
  }

  hasProp(key: string): boolean {

    if(!this.selectedObjects[0]) return false

    return this.selectedObjects[0].hasProp(key)
  }

  removeProp(key: string) {

    this.selectedObjects.forEach(object => {

      object.removeProp(key)
    })
  }

/*
██████╗ ███████╗███╗   ███╗ ██████╗ ██╗   ██╗███████╗
██╔══██╗██╔════╝████╗ ████║██╔═══██╗██║   ██║██╔════╝
██████╔╝█████╗  ██╔████╔██║██║   ██║██║   ██║█████╗  
██╔══██╗██╔══╝  ██║╚██╔╝██║██║   ██║╚██╗ ██╔╝██╔══╝  
██║  ██║███████╗██║ ╚═╝ ██║╚██████╔╝ ╚████╔╝ ███████╗
╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝   ╚═══╝  ╚══════╝
*/
	/**
	 * Called by user from leftSideMenu.component.html
	 */
  public removeAllSelectedElementsUndo() {

		// Remove the elements
    this.selectedObjects.forEach(selectedObject => {

				const oldParent = selectedObject.parent
				const oldIndex = oldParent.children.indexOf(selectedObject)

        selectedObject.deleteMe()

				// Make sure it can be undone
				this.commands.push(new CreationDeletion(oldParent.id, selectedObject.saveLayout, oldIndex, undefined, this))
    })
  }

	public copySelectedElements() {

		let copiedElements: SaveLayout[] = []
		this.selectedObjects.forEach(object => {

			copiedElements.push(object.saveLayout)
		})

		// Store the copied elements into the clipboard of the OS
		navigator.clipboard.writeText(JSON.stringify(copiedElements))

		let toast: Toast = new Toast({

			title: 'Element kopiert.',
			content: '',
			timeOut: 5000
		})

		toast.appendTo('#toastContainer')
		toast.show()

		console.log('copiedElements', JSON.stringify(copiedElements))
	}

	public async pasteElements() {

		console.log('Pasting elements...')

		// Get the copied elements from the clipboard of the OS
		let clipBoardcContent = await navigator.clipboard.readText()
		console.log('clipBoardcContent', clipBoardcContent)
		let copiedElements: SaveLayout[] = []

		try {

			copiedElements = JSON.parse(clipBoardcContent)
		}
		catch (err) {

			let toast: Toast = new Toast({

				title: '⚠️ Kein Element in der zwischenablage.',
				content: '',
				timeOut: 5000
			})

			toast.appendTo('#toastContainer')
			toast.show()
		}

		if(copiedElements.length == 0) return

		// Create the elements from the copied elements
		for (const copiedElement of copiedElements) {

			this.renderRecursive(this.selectedObjects[0], copiedElement)
		}
	}

/*
 ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗██╗███╗   ██╗ ██████╗     ███████╗████████╗██╗   ██╗███████╗███████╗
██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██║████╗  ██║██╔════╝     ██╔════╝╚══██╔══╝██║   ██║██╔════╝██╔════╝
██║     ███████║█████╗  ██║     █████╔╝ ██║██╔██╗ ██║██║  ███╗    ███████╗   ██║   ██║   ██║█████╗  █████╗
██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██║██║╚██╗██║██║   ██║    ╚════██║   ██║   ██║   ██║██╔══╝  ██╔══╝
╚██████╗██║  ██║███████╗╚██████╗██║  ██╗██║██║ ╚████║╚██████╔╝    ███████║   ██║   ╚██████╔╝██║     ██║
 ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝     ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝
*/
  allLayouts(): boolean{

    if(!this.selectedObjects[0]) return false

    for(let object of this.selectedObjects) if(!object.isLayout) return false

    return true
  }

  rootObjectSelected(): boolean{

    if(!this.selectedObjects[0]) return true

    for(let object of this.selectedObjects) if(object.isRootNode) return true

    return false
  }

	// If all the selected elements are of the same type, then the name is stored here
	allOfType = ""
  private setAllOfType(type: string){

    if(!this.selectedObjects[0]){

			this.allOfType = ""
			return
		}

    for(let object of this.selectedObjects){

			if(object.type != type){

				this.allOfType = ""
				return
			}
		}

    this.allOfType = type
  }

	/*
 ██████╗ ██╗      ██████╗ ██████╗  █████╗ ██╗         ███████╗████████╗██╗   ██╗██╗     ███████╗
██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔══██╗██║         ██╔════╝╚══██╔══╝╚██╗ ██╔╝██║     ██╔════╝
██║  ███╗██║     ██║   ██║██████╔╝███████║██║         ███████╗   ██║    ╚████╔╝ ██║     █████╗
██║   ██║██║     ██║   ██║██╔══██╗██╔══██║██║         ╚════██║   ██║     ╚██╔╝  ██║     ██╔══╝
╚██████╔╝███████╗╚██████╔╝██████╔╝██║  ██║███████╗    ███████║   ██║      ██║   ███████╗███████╗
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝    ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚══════╝
	*/
	/**
	 * ### Global Style name was changed for selected elements
	 * Check if this global style exists at root, if yes, applies it to the selected elements
	 * @param value Is the name of the global style
	 */
	checkIfThisStyleExistsThenApply(value: string) {

		let globalStyles = this.rootNode.getProp(value)

		if(!globalStyles) return

		let globalStylesArray: Property[] = JSON.parse(globalStyles)

		this.applyStyleToAll(this.selectedObjects, globalStylesArray)
	}

	/**
	 * ### Apply global style to the given elements
	 * Applies the given global Styles to all the given elements
	 * @param elements The elements to apply the style to
	 * @param globalStylesArray The global styles to apply - a property array
	 */
	applyStyleToAll(elements: LayoutComponent[], globalStylesArray: Property[]) {

		elements.forEach((element) => {

			globalStylesArray.forEach((prop: Property) => {

				if(	prop.key == 'displayName' ||
						prop.key == 'globalStyle'
					) return

				// We need to set the correct id of the savelayout,
				// because this prop is from another element and it sill has the old saveLayout.id
				// prop.saveLayout ? prop.saveLayout.id = element.saveLayout.id : ""
				element.setAndRenderPropUndo(prop)
			})
		})
	}

	/**
	 * Save the style from the current element to the root and
	 * apply it to all who have the same global style
	 */
	saveStyleFromCurrElementToRootAndApplyToAll() {

		const properties = this.selectedObjects[0].saveLayout.properties
		if(!properties) return

		let nameOfTheGlobalStyle = this.selectedObjects[0].getProp('globalStyle')
		this.rootNode.setPropAsHelperUndo(nameOfTheGlobalStyle, JSON.stringify(properties))

		this.applyStyleToAll(this.findElementsByGlobalStyle(nameOfTheGlobalStyle), properties)
	}
}

function getDragIcon(): HTMLElement {

	const icon = document.createElement('div')
	icon.id = 'drag1'
	icon.draggable = true

	// Style dynamisch hinzufügen
	icon.style.position = 'absolute'
	icon.style.top = '2px'
	icon.style.right = '0px'
	icon.style.cursor = 'grab'

	icon.innerHTML = `
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
			<path fill="#a6a6a6" fill-rule="evenodd" d="M19 10a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-4 18a4 4 0 1 0 0-8a4 4 0 0 0 0 8m0 14a4 4 0 1 0 0-8a4 4 0 0 0 0 8m22-32a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-4 18a4 4 0 1 0 0-8a4 4 0 0 0 0 8m0 14a4 4 0 1 0 0-8a4 4 0 0 0 0 8" clip-rule="evenodd"/>
		</svg>
	`

	return icon
}