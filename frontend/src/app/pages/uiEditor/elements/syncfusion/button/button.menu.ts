import { Component } from '@angular/core'
import { Menu } from '../../../sharedMenus/_menu/menu'

@Component({
    selector: 'sf-button-menu',
    template: `

<div *ngIf="uiEditorService.allOfType == 'sf-button'">

  <!-- text -->
  <input-field [width]="'100%'" [propName]="'text'" [isCss]="false"></input-field>

  <!-- is primary? -->
	<div style="margin-top: 10px;">
    <toggle-menu propName="isPrimary"></toggle-menu>
  </div>

  <!-- Type -->
	<dropdown-menu propName="type" [dataSource]="['normal', 'outline', 'flat', 'success', 'warning', 'danger', 'info']"></dropdown-menu>
</div>

`,
    styleUrls: ['../../../../../../styles/material3.min.css'],
    standalone: false
})

export class SfButtonComponentMenu extends Menu {}