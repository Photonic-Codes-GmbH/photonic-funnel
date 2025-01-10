import { Component, Output, EventEmitter } from '@angular/core'
import { ResizeHandle } from './types/resize.types'

@Component({
  selector: 'resize-handles',
  standalone: true,
  template: `
    <div class="handle corner top-left" (mousedown)="onHandleMouseDown($event, 'top-left')"></div>
    <div class="handle corner top-right" (mousedown)="onHandleMouseDown($event, 'top-right')"></div>
    <div class="handle corner bottom-left" (mousedown)="onHandleMouseDown($event, 'bottom-left')"></div>
    <div class="handle corner bottom-right" (mousedown)="onHandleMouseDown($event, 'bottom-right')"></div>
    <div class="handle edge top" (mousedown)="onHandleMouseDown($event, 'top')"></div>
    <div class="handle edge right" (mousedown)="onHandleMouseDown($event, 'right')"></div>
    <div class="handle edge bottom" (mousedown)="onHandleMouseDown($event, 'bottom')"></div>
    <div class="handle edge left" (mousedown)="onHandleMouseDown($event, 'left')"></div>
  `,
  styleUrls: ['./resizable.css']
})
export class ResizeHandlesComponent {
  @Output() handleMouseDown = new EventEmitter<{
    event: MouseEvent
    handle: ResizeHandle
  }>()

  onHandleMouseDown(event: MouseEvent, handle: ResizeHandle): void {
    this.handleMouseDown.emit({ event, handle })
    event.preventDefault()
  }
}