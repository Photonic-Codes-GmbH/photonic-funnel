import { Injectable } from '@angular/core'
import { ResizeHandle, ResizeState } from './types/resize.types'

@Injectable()
export class ResizeService {

  minSize = 25

  calculateNewDimensions(
    handle: ResizeHandle,
    startDimensions: ResizeState,
    dx: number,
    dy: number
  ): ResizeState {

    const { width: startWidth, height: startHeight, top: startTop, left: startLeft } = startDimensions
    let newState: ResizeState = { ...startDimensions }

    switch (handle) {

      case 'top':
        newState.height = Math.max(this.minSize, startHeight - dy)
        newState.top = startTop + (startHeight - newState.height)
        break

      case 'right':
        newState.width = Math.max(this.minSize, startWidth + dx)
        break

      case 'bottom':
        newState.height = Math.max(this.minSize, startHeight + dy)
        break

      case 'left':
        newState.width = Math.max(this.minSize, startWidth - dx)
        newState.left = startLeft + (startWidth - newState.width)
        break

      case 'top-left':
        newState.width = Math.max(this.minSize, startWidth - dx)
        newState.height = Math.max(this.minSize, startHeight - dy)
        newState.left = startLeft + (startWidth - newState.width)
        newState.top = startTop + (startHeight - newState.height)
        break

      case 'top-right':
        newState.width = Math.max(this.minSize, startWidth + dx)
        newState.height = Math.max(this.minSize, startHeight - dy)
        newState.top = startTop + (startHeight - newState.height)
        break

      case 'bottom-left':
        newState.width = Math.max(this.minSize, startWidth - dx)
        newState.height = Math.max(this.minSize, startHeight + dy)
        newState.left = startLeft + (startWidth - newState.width)
        break

      case 'bottom-right':
        newState.width = Math.max(this.minSize, startWidth + dx)
        newState.height = Math.max(this.minSize, startHeight + dy)
        break
    }

    return newState
  }
}