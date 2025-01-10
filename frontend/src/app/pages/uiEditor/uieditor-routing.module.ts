import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { UiEditorComponent } from './uieditor.component'

const routes = [
	{ path: '', component: UiEditorComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UiEditorRoutingModule {}
