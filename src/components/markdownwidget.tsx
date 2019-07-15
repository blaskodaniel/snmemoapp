import React from 'react'
import { Typography } from '@material-ui/core'
import ReactMarkdown from 'react-markdown'
import { MarkdownWidgetI } from '../interfaces'

export const MarkdownWidget: React.FunctionComponent<MarkdownWidgetI> = props => {
  return (
    <div>
      <Typography
        variant="h5"
        title={props.title}
        gutterBottom={true}
        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {props.title}
      </Typography>
      <div style={{ overflow: 'auto' }}>
        <ReactMarkdown escapeHtml={false} source={props.settings.content} />
      </div>
    </div>
  )
}
