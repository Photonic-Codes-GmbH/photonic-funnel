import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ButtonModule, CheckBoxModule, ChipListModule, SwitchModule } from '@syncfusion/ej2-angular-buttons'
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns'
import { EditService, ExcelExportService, FilterService, GridModule, GroupService, PageService, SelectionService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids'
import { ColorPickerModule, SliderModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs'
import { ListViewModule } from '@syncfusion/ej2-angular-lists'
import { AppBarModule, SidebarModule, TabModule } from '@syncfusion/ej2-angular-navigations'
import { DialogModule, TooltipModule } from '@syncfusion/ej2-angular-popups'
import { ProgressButtonModule } from '@syncfusion/ej2-angular-splitbuttons'
import { SkeletonModule, ToastModule } from '@syncfusion/ej2-angular-notifications'
import { FileManagerAllModule, FileManagerModule } from '@syncfusion/ej2-angular-filemanager'

@NgModule({
  exports: [
		ButtonModule,
		CheckBoxModule,
		ColorPickerModule,
		TextBoxModule, FormsModule, // Für [(ngModel)]
		DropDownListModule,
    AppBarModule,
    SidebarModule,
    ListViewModule,
    GridModule,
		TabModule,
		ProgressButtonModule,
		SwitchModule,
		ChipListModule,
		DialogModule,
		TooltipModule,
		SliderModule,
		SkeletonModule,
		ToastModule,
		FileManagerModule, FileManagerAllModule
  ],
  providers: [
		/* For Grid */ PageService, SortService, FilterService, GroupService, ToolbarService, ExcelExportService, SelectionService, EditService
  ]
})
export class SyncfusionModule {}
