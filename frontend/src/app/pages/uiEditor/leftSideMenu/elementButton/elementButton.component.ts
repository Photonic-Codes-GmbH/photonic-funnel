import { Component, Input } from '@angular/core'
import { UiEditorService } from '../../services/uiEditor.service'
import { HttpClient } from '@angular/common/http'

@Component({
    selector: 'elementButton',
    template: `

<button ejs-button cssClass="e-flat" isPrimary="true" (click)="uiEditorService.createElementsIntoAllSelectedUndo(name)">

	<div style="display: flex; align-items: center; justify-content: flex-start; gap: 5px;">
		<div [id]="'svgDiv'+name"></div>
		<a translate>leftMenu.{{name}}</a>
	</div>

</button>

		`,
    standalone: false
})
export class ElementButtonComponent {

	@Input() name: string
	@Input() noTranslate: boolean = false

	constructor(
		public uiEditorService: UiEditorService,
		private http: HttpClient) { }

	ngOnInit() {

		this.http
			.get('../../../../../assets/elements/'+this.name+'.svg', { responseType: 'text' })
			.subscribe((svg) => {

				document.getElementById('svgDiv'+this.name)!.innerHTML = svg
			})
	}
}
