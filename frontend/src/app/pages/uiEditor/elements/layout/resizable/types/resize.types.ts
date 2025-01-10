export type ResizeHandle = 'top' | 'right' | 'bottom' | 'left' | 
                          'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface ResizeState {
  width: number
  height: number
  top: number
  left: number
}