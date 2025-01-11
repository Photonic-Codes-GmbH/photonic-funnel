import { NgModule } from '@angular/core'
import { ButtonModule, CheckBoxModule, ChipListModule, SwitchModule } from '@syncfusion/ej2-angular-buttons'
import { DatePickerModule, TimePickerModule } from '@syncfusion/ej2-angular-calendars'
import { ColorPickerModule, TextBoxModule, SliderModule } from '@syncfusion/ej2-angular-inputs'
import { KanbanModule } from '@syncfusion/ej2-angular-kanban'
import { ScheduleModule, YearService } from '@syncfusion/ej2-angular-schedule'
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns'
import { AccumulationAnnotationService, AccumulationChartModule, AccumulationDataLabelService, AccumulationLegendService, AccumulationTooltipService, AreaSeriesService, ChartAllModule, ChartModule, ColumnSeriesService, MultiColoredAreaSeriesService, PieSeriesService, RangeAreaSeriesService, SplineAreaSeriesService, SplineRangeAreaSeriesService, SplineSeriesService, StackingAreaSeriesService, StackingStepAreaSeriesService, StepAreaSeriesService, ZoomService } from '@syncfusion/ej2-angular-charts'
import { AgendaService, DayService, MonthAgendaService, MonthService, TimelineMonthService, TimelineViewsService, WeekService, WorkWeekService } from '@syncfusion/ej2-angular-schedule'
import { CategoryService, DataLabelService, LegendService, LineSeriesService, TooltipService } from '@syncfusion/ej2-angular-charts'
import { AppBarModule, SidebarModule, TabModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations'
import { ListViewModule } from '@syncfusion/ej2-angular-lists'
import { CircularGaugeModule, GaugeTooltipService } from '@syncfusion/ej2-angular-circulargauge'
import { PageService, SortService, FilterService, GroupService, ToolbarService as ToolbarServiceGrid, ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids'
import { ProgressButtonModule } from '@syncfusion/ej2-angular-splitbuttons'
import { FormsModule } from '@angular/forms'
import { MapsModule } from '@syncfusion/ej2-angular-maps'
import { DialogModule, TooltipModule } from '@syncfusion/ej2-angular-popups'
import { SkeletonModule, ToastModule } from '@syncfusion/ej2-angular-notifications'
import { FileManagerAllModule, FileManagerModule, NavigationPaneService, ToolbarService as ToolbarServiceFM, DetailsViewService } from '@syncfusion/ej2-angular-filemanager'
import { DocumentEditorContainerModule, DocumentEditorModule, PrintService, TextExportService, SelectionService, SearchService, EditorService, ImageResizerService,
	EditorHistoryService, ContextMenuService, OptionsPaneService, HyperlinkDialogService, TableDialogService, BookmarkDialogService, TableOfContentsDialogService,
	PageSetupDialogService, StyleDialogService, ListDialogService, ParagraphDialogService, BulletsAndNumberingDialogService, FontDialogService, TablePropertiesDialogService,
	BordersAndShadingDialogService, TableOptionsDialogService, CellOptionsDialogService, StylesDialogService,
	WordExportService, SfdtExportService, ToolbarService as ToolbarServiceDocumentEditor } from '@syncfusion/ej2-angular-documenteditor'
	import { AudioService, CountService, EmojiPickerService, FileManagerService, FormatPainterService, HtmlEditorService, ImageService, ImportExportService, LinkService, PasteCleanupService, QuickToolbarService, RichTextEditorAllModule, SlashMenuService, TableService, ToolbarService as ToolbarServiceRT, VideoService } from '@syncfusion/ej2-angular-richtexteditor'

@NgModule({
	exports: [
		KanbanModule,
		ButtonModule, ProgressButtonModule,
		CheckBoxModule,
		ColorPickerModule,
		TextBoxModule, FormsModule, // Für [(ngModel)]
		DatePickerModule, TimePickerModule,
		ScheduleModule,
		DropDownListModule,
		ChartModule, ChartAllModule, AccumulationChartModule, CircularGaugeModule,
		AppBarModule, SidebarModule,
		ListViewModule,
		GridModule,
		TabModule,
		MapsModule,
		SwitchModule,
		ChipListModule,
		DialogModule,
		TooltipModule,
		SliderModule,
		TreeViewModule,
		SkeletonModule,
		ToastModule,
		FileManagerModule, FileManagerAllModule,
		DocumentEditorContainerModule,
		RichTextEditorAllModule
	],
	providers: [
		/* For Schedule */ DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService, YearService,
		/* For Chart */ CategoryService, LegendService, TooltipService, DataLabelService, LineSeriesService, AreaSeriesService, RangeAreaSeriesService, StepAreaSeriesService, StackingAreaSeriesService,
										MultiColoredAreaSeriesService, StackingStepAreaSeriesService, SplineRangeAreaSeriesService, ColumnSeriesService, SplineSeriesService, SplineAreaSeriesService,
		/* For Pie and Donut */ PieSeriesService, AccumulationLegendService, AccumulationTooltipService, AccumulationDataLabelService, AccumulationAnnotationService,
		/* For CircularGauge */ GaugeTooltipService,
		/* For Grid */ PageService, SortService, FilterService, GroupService, ToolbarServiceGrid, ExcelExportService,
		/* For Maps */ ZoomService,
		/* For FileManager */ NavigationPaneService, ToolbarServiceFM, DetailsViewService,
		/* For DocumentEditor */ ToolbarServiceDocumentEditor, PrintService, SfdtExportService, WordExportService, TextExportService, SelectionService, SearchService, EditorService, ImageResizerService,
										EditorHistoryService, ContextMenuService, OptionsPaneService, HyperlinkDialogService, TableDialogService, BookmarkDialogService, TableOfContentsDialogService,
										PageSetupDialogService, StyleDialogService, ListDialogService, ParagraphDialogService, BulletsAndNumberingDialogService, FontDialogService, TablePropertiesDialogService,
										BordersAndShadingDialogService, TableOptionsDialogService, CellOptionsDialogService, StylesDialogService,
		/* For RichTextEditor */ ToolbarServiceRT, QuickToolbarService, LinkService, ImageService, HtmlEditorService, TableService, FileManagerService, EmojiPickerService, VideoService, AudioService, FormatPainterService, PasteCleanupService, CountService, SlashMenuService, ImportExportService
	]
})
export class SyncfusionModule {}
