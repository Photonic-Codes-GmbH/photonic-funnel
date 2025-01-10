import { NgModule } from '@angular/core'
import { ButtonModule } from '@syncfusion/ej2-angular-buttons'
import { ToolbarModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations'
import { DialogModule, TooltipModule } from '@syncfusion/ej2-angular-popups'
import { ToastModule } from '@syncfusion/ej2-angular-notifications'

@NgModule({
  exports: [
    // KanbanModule,
		ButtonModule,
		// CheckBoxModule,
		// ColorPickerModule,
		// TextBoxModule, FormsModule, // Für [(ngModel)]
		// DatePickerModule,
		// TimePickerModule,
		// ScheduleModule,
		// DropDownListModule,
		// ChartModule, ChartAllModule, AccumulationChartModule,
    // AppBarModule,
    // SidebarModule,
    // ListViewModule,
    // CircularGaugeModule,
    // GridModule,
		// TabModule,
		// MapsModule,
		// ProgressButtonModule,
		// SwitchModule,
		// ChipListModule,
		ToastModule,
		DialogModule,
		TooltipModule,
		// SliderModule,
		ToolbarModule,
		TreeViewModule,
  ],
  providers: [
		// /* For Schedule */ DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService, YearService,
		// /* For Chart */ CategoryService, LegendService, TooltipService, DataLabelService, LineSeriesService, AreaSeriesService, RangeAreaSeriesService, StepAreaSeriesService, StackingAreaSeriesService,
    //                 MultiColoredAreaSeriesService,StackingStepAreaSeriesService,SplineRangeAreaSeriesService, ColumnSeriesService, SplineSeriesService, SplineAreaSeriesService,
		// /* For Pie and Donut */ PieSeriesService, AccumulationLegendService, AccumulationTooltipService, AccumulationDataLabelService, AccumulationAnnotationService,
    // /* For CircularGauge */ GaugeTooltipService,
		// /* For Grid */ PageService, SortService, FilterService, GroupService, ToolbarService, ExcelExportService,
		// /* For Maps */ ZoomService,
  ]
})
export class UiEditorSfModule {}
