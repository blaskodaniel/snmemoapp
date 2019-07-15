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
