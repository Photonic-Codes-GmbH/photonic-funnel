import { AfterViewInit, Component } from '@angular/core'

// import { TreeSearchService } from 'src/app/shared/services/tree-search.service'
import { UiEditorService } from '../services/uiEditor.service'

@Component({
    selector: 'leftSideMenu',
    templateUrl: './leftSideMenu.component.html',
    styleUrls: ['./leftSideMenu.component.scss'],
    standalone: false
})
export class LeftSideMenuComponent implements AfterViewInit {
	constructor(
		public uiEditorService: UiEditorService,
		// public treeSearchService: TreeSearchService,
	) { }

	ngAfterViewInit(): void {

		this.nativeElement = document.getElementsByTagName('app-leftMenu')[0] as HTMLElement
	}

	nativeElement: HTMLElement
}
