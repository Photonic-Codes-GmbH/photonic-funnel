import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedMenusModule } from '../../sharedMenus/sharedMenus.module'
// import { SfAppBarComponentMenu } from '../syncfusion/appBar/appBar.menu'
import { FormsModule } from '@angular/forms'
import { SfButtonComponentMenu } from './button/button.menu'
import { SfRichTextMenu } from './richText/richText.menu'
// import { SfChartComponentMenu } from '../syncfusion/chart/chart.menu'
// import { SfCheckboxComponentMenu } from '../syncfusion/checkbox/checkbox.menu'
// import { SfDataGridComponentMenu } from '../syncfusion/dataGrid/dataGrid.menu'
// import { SfDatepickerComponentMenu } from '../syncfusion/datepicker/datepicker.menu'
// import { SfDropdownComponentMenu } from '../syncfusion/dropdown/dropdown.menu'
// import { SfKanbanComponentMenu } from '../syncfusion/kanban/kanban.menu'
// import { SfMapComponentMenu } from '../syncfusion/map/map.menu'
// import { SfScheduleComponentMenu } from '../syncfusion/schedule/schedule.menu'
// import { SfSideBarComponentMenu } from '../syncfusion/sideBar/sideBar.menu'
// import { SfTabsComponentMenu } from '../syncfusion/tabs/tabs.menu'
// import { SfTextboxComponentMenu } from '../syncfusion/textbox/textbox.menu'
// import { SfTimepickerComponentMenu } from '../syncfusion/timepicker/timepicker.menu'

const declarationsNexports = [
	SfButtonComponentMenu,
	SfRichTextMenu,
	// SfCheckboxComponentMenu,
	// SfTextboxComponentMenu,
	// SfDatepickerComponentMenu,
	// SfTimepickerComponentMenu,
	// SfScheduleComponentMenu,
	// SfDropdownComponentMenu,
	// SfChartComponentMenu,
	// SfDataGridComponentMenu,
	// SfTabsComponentMenu,
	// SfAppBarComponentMenu,
	// SfSideBarComponentMenu,
	// SfMapComponentMenu,
	// SfKanbanComponentMenu,
]

@NgModule({
	declarations: declarationsNexports,
  exports: declarationsNexports,
  imports: [
		CommonModule,
		SharedMenusModule,
		FormsModule,
  ],
})

export class RightSideElementMenusModule {
}
