import { CommonModule } from '@angular/common'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { CustomCodeComponent } from './elements/customCode/customCode.component'
import { SfElementsModule } from './elements/syncfusion/sfElements.module'
import { ElementButtonComponent } from './leftSideMenu/elementButton/elementButton.component'
import { LeftSideMenuComponent } from './leftSideMenu/leftSideMenu.component'
import { RightSideMenuModule } from './rightSideMenu/rightSideMenu.module'
import { RightSideBasicMenusModule } from './rightSideMenu/rightSideMenus/rightSideBasicMenus.module'
import { UiEditorService } from './services/uiEditor.service'
import { AppHierarchyTree } from './tree-app-hierarchy/treeAppHierarchy.component'
import { UiEditorRoutingModule } from './uieditor-routing.module'
import { UiEditorComponent } from './uieditor.component'
import { UiEditorSfModule } from './uieditor.sf.module'
import { CommandComponent } from './undoRedo/components/command.component'
import { CommandManagerService } from './undoRedo/services/commandManager.service'
import { ResizeService } from './elements/layout/resizable/resize.service'
import { MediaDialogComponent } from './mediaBrowser/mediaDialog.component'
import { UiDownloadService } from './services/uiDownload.service'

// Das hier ist für die Übersetzung mit ngx-translate
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {

  return new TranslateHttpLoader(http)
}

/*
	In dem Fall, wo das oberste Modul lazy-loaded wird und das Untermodul nur in das oberste Modul importiert wird:
	Da das oberste Modul erst beim Lazy Loading geladen wird, spielt es eine geringere Rolle, wie viele Syncfusion-Komponenten darin enthalten sind.
	Selbst wenn du die Syncfusion-Komponenten auf das Untermodul verteilst, ändert sich nicht viel in Bezug auf die Performance, da beide Module
	zusammen geladen werden, wenn das übergeordnete Modul lazy-loaded wird.
	Die Aufteilung auf Untermodule kann jedoch helfen, die Lesbarkeit und Wartbarkeit des Codes zu verbessern.
*/

@NgModule({
		exports: [],
    declarations: [
			UiEditorComponent,
			LeftSideMenuComponent,
			ElementButtonComponent,
			AppHierarchyTree,
			CustomCodeComponent,
			CommandComponent
    ],
		imports: [
			CommonModule,
			UiEditorRoutingModule,
			RightSideMenuModule,
			UiEditorSfModule,
			SfElementsModule,
			MediaDialogComponent,
			RightSideBasicMenusModule,
			TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				}
			})
		],
		providers: [
			provideHttpClient(withInterceptorsFromDi()),
			UiEditorService,
			CommandManagerService,
			ResizeService,
			UiDownloadService
		]
	})
export class UiEditorModule {}
