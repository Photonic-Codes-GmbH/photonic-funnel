import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core'
import { LayoutComponent } from '../elements/layout/layout.component'
import { UiEditorService } from '../services/uiEditor.service'

/**
 * @title Tree with nested nodes
 */
@Component({
    selector: '_treeAppHierarchy',
    template: 'tree-app-hierarchy.component copy.html',
    // styleUrls: ['treeAppHierarchy.component.scss'],
    standalone: false
})
export class TreeAppHierarchyComponentCopy implements AfterViewInit, OnInit {

  treeControl: any = {}//new NestedTreeControl<LayoutComponent>(node => node.children)
  dataSource: any// = new MatTreeNestedDataSource<LayoutComponent>()
  dragging: LayoutComponent

  constructor(
    public readonly uiEditorService: UiEditorService,
    private readonly renderer: Renderer2,
  ) {

    // uiEditorService.tree = this
  }

	public field: Object

  ngOnInit(): void {

    this.updateDatasourceAndExpand()
		this.field = {
			dataSource: this.uiEditorService.rootNode,
			id: 'id',
			text: 'name',
			child: 'subChild'
		}
  }

  ngAfterViewInit(): void {

    let nestedTreeNodes = document.getElementsByTagName('nested-tree-node')

    // Starts with 1 because skip rootNode
    for(let i = 1 ; i < nestedTreeNodes.length ; i++) {

      let currentNestedTreeNode = nestedTreeNodes.item(i)!

      let expandableNode = currentNestedTreeNode.getElementsByClassName("expandable-node")[0] as HTMLElement
      let heigth = expandableNode.offsetHeight;

      let ariaExp = currentNestedTreeNode.getAttribute("aria-expanded")

      if(ariaExp =="false")
            this.renderer.setStyle(expandableNode, "height", (heigth*0.75)+"px")

      let belowNestedList = currentNestedTreeNode.getElementsByClassName("below")
      let belowNested = belowNestedList[belowNestedList.length-1]
      this.renderer.setStyle(belowNested, "height", (heigth*0.25)+"px")
    }
  }

  hasChild = (_: number, node: LayoutComponent) => !!node.children && node.children.length > 0

  updateDatasourceAndExpand() {

    // this.treeControl.expand(this.uiEditorService.rootNode)

		// Datasource is like the datasource of a matTable
		// The following hack is to force the update of the datasource
    this.dataSource.data = [this.uiEditorService.rootNode]
    let _data = this.dataSource.data
    this.dataSource.data = []
    this.dataSource.data = _data

    this.ngAfterViewInit()
  }

	expandTo(node: LayoutComponent) {

		this.expandToRecursive(node)

    this.updateDatasourceAndExpand()
	}

	expandToRecursive(node: LayoutComponent) {

		let parent = node.parent

		if(!parent) return

		this.treeControl.expand(parent)
		this.expandToRecursive(parent)
	}

  drag(draggingNode: LayoutComponent) {

    this.dragging = draggingNode;
  }

  dragover(event: DragEvent, dragOverNode: LayoutComponent) {

    if(dragOverNode.isRootNode) return
    if (this.dragging == dragOverNode) return

    event.preventDefault();

    let element = event.target as HTMLElement

    if (dragOverNode.isLayout && element.classList.contains('center')) {

      element.classList.add('draggingAsChild')
      return
    }

    if (element.classList.contains('below')) element.classList.add('draggingUnderMe')
    else element.classList.add('draggingOverMe')
  }

  dragleave(event: DragEvent) {

    let element = event.target as HTMLElement

    element.classList.remove('draggingOverMe')
    element.classList.remove('draggingAsChild')
    element.classList.remove('draggingUnderMe')
  }

  drop(event: DragEvent, droppedOnNode: LayoutComponent) {

    event.preventDefault()

    if (this.dragging == droppedOnNode) return

    let element = event.target as HTMLElement
    let newParent: LayoutComponent

    let dropAsChild = element.classList.contains('draggingAsChild')
    let update: boolean = false

    // Get dragged item data
    let oldParent = this.dragging.parent
    let currentIndex = oldParent.children.findIndex((item: LayoutComponent) => item === this.dragging)

    // Remove the dragged item from current array
    oldParent.children.splice(currentIndex, 1)

    if (dropAsChild) {

      // Set parents children
      droppedOnNode.children.splice(0, 0, this.dragging)

      // Set new parent
      newParent = droppedOnNode

      // Add it as the first child
      // this.dragging.saveElement.prevNeighbor = undefined

      update = true
    }

    // DROP ABOVE OR BELOW
    else {

      let dropBelow = element.classList.contains('draggingUnderMe')

      // Get dropped node data
      newParent = droppedOnNode.parent
      let droppedIndex = newParent.children.findIndex((item: LayoutComponent) => item === droppedOnNode)

      // Get the sides without the dropped node
      let leftSide = newParent.children.slice(0, droppedIndex)
      let rightSide = newParent.children.slice(droppedIndex + 1)

      // Set the destination array
      newParent.children = dropBelow ?
        [...leftSide, droppedOnNode, this.dragging, ...rightSide] :
        [...leftSide, this.dragging, droppedOnNode, ...rightSide]

      // this.dragging.saveElement.prevNeighbor = dropBelow ? droppedOnNode.saveElement : droppedOnNode.saveElement.prevNeighbor

      update = true
    }

    // Parent is changing
    if (oldParent !== newParent) {

      this.dragging.parent = newParent

      // Move under DOM parent
      newParent.nativeElement.appendChild(this.dragging.nativeElement)

      this.dragging.saveLayout.parent = newParent.saveLayout
      update = true
    }

    // if (update) {

    //   this.editorElementService.update(this.dragging.saveLayout, sl => {

    //     this.uiEditorService.dataService.loadPageIntoTheApp(this.uiEditorService.dataService.currentPage.page)
    //     this.uiEditorService.setSelected(this.uiEditorService.findElementById(this.dragging.saveElement.id)[0])
    //   })
    // }

    this.updateDatasourceAndExpand()
  }
}
