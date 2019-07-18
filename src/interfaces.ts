import { widgetTypes } from './utils'

export interface WidgetI<T> {
  title: string
  widgetType: typeof widgetTypes[number]
  settings: T
  minWidth?: number
}
export interface MarkdownWidgetI extends WidgetI<{ content: string }> {
  widgetType: 'markdown'
}

export interface ReduxMemostateI {
  type: string
  value: string
}

export interface DialogPropsI {
  open: boolean
  title: string
  onClose: (value: boolean) => void
}

export interface NewMemoI {
  DisplayName: string
  Description: string
}

export interface AddNewI {
  show: boolean
  onCreate: (memo: NewMemoI) => void
  onClose: () => void
}
