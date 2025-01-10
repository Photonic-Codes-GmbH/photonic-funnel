import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DetailsViewService, NavigationPaneService, ToolbarService } from '@syncfusion/ej2-angular-filemanager'
import { SyncfusionModule } from './syncfusion.module'
import { ConfigService } from 'src/app/core/services/config.service'

@Component({
	selector: 'mediaDialog-root',
	imports: [ FormsModule, SyncfusionModule ],
	providers: [ NavigationPaneService, ToolbarService, DetailsViewService ],
	templateUrl: './mediaDialog.component.html',
	styleUrl: './mediaDialog.component.scss',
	standalone: true
})
export class MediaDialogComponent {

  public constructor(
      private readonly config: ConfigService,
  ) {}

  public hostUrl: string = `${this.config.baseUrl}/file-manager/`
  public ajaxSettings = {
    url: this.hostUrl + 'operations',
    uploadUrl: this.hostUrl + 'upload',
    downloadUrl: this.hostUrl + 'download',
    getImageUrl: this.hostUrl + 'getImage',
  }

  public toolbarSettings = {
    items: ['NewFolder', 'Upload', 'Delete', 'Rename', 'Download', 'SortBy', 'Refresh', 'View', 'Details'],
  }

  public contextMenuSettings = {
    file: ['Open', '|', 'Download', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', '|', 'Details'],
    folder: ['Open', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', '|', 'Details'],
    visible: true,
  }
}
