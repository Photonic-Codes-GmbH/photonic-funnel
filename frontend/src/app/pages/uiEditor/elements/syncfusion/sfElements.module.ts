import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
// import { SfAppBarComponent } from '../syncfusion/appBar/appBar.component'
import { ButtonComponent } from './button/button.component'
// import { SfChartComponent } from '../syncfusion/chart/chart.component'
// import { SfCheckboxComponent } from '../syncfusion/checkbox/checkbox.component'
// import { SfDataGridComponent } from '../syncfusion/dataGrid/dataGrid.component'
// import { SfDatepickerComponent } from '../syncfusion/datepicker/datepicker.component'
// import { SfDropdownComponent } from '../syncfusion/dropdown/dropdown.component'
// import { SfKanbanComponent } from '../syncfusion/kanban/kanban.component'
// import { SfMapComponent } from '../syncfusion/map/map.component'
// import { SfScheduleComponent } from '../syncfusion/schedule/schedule.component'
// import { SfSideBarComponent } from '../syncfusion/sideBar/sideBar.component'
// import { SfTabsComponent } from '../syncfusion/tabs/tabs.component'
// import { SfTextboxComponent } from '../syncfusion/textbox/textbox.component'
// import { SfTimepickerComponent } from '../syncfusion/timepicker/timepicker.component'
import { SyncfusionModule } from './syncfusion.module'
import { RichTextComponent } from './richText/richText.component'

const declarationsNexports = [
	ButtonComponent,
	RichTextComponent,
	// SfCheckboxComponent,
	// SfTextboxComponent,
	// SfDatepickerComponent,
	// SfTimepickerComponent,
	// SfScheduleComponent,
	// SfDropdownComponent,
	// SfChartComponent,
	// SfDataGridComponent,
	// SfTabsComponent,
	// SfAppBarComponent,
	// SfSideBarComponent,
	// SfMapComponent,
	// SfKanbanComponent,
]

@NgModule({
  exports: [declarationsNexports],
	declarations: [declarationsNexports],
  imports: [
		CommonModule,
		SyncfusionModule,
  ]
})
export class SfElementsModule {}
