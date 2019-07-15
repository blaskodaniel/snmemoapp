import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import moment from 'moment'
import Fab from '@material-ui/core/Fab'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ReactMarkdown from 'react-markdown'
import { Grid } from '@material-ui/core'
import { ConstantContent, ODataCollectionResponse } from '@sensenet/client-core'
import { GenericContent, User } from '@sensenet/default-content-types'
import { useRepository } from '../hooks/use-repository'

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    fab: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }),
)

export const MemoPanel: React.FunctionComponent = () => {
  const repo: any = useRepository()
  const classes: any = useStyles()
  const [expanded, setExpanded] = useState<string | false>(false)
  const [editmode, setEditmode] = useState<string | false>(false)
  const [data, setData] = useState<GenericContent[]>([])

  useEffect(() => {
    async function loadMemos(): Promise<void> {
      const result: ODataCollectionResponse<GenericContent> = await repo.loadCollection({
        path: `${ConstantContent.PORTAL_ROOT.Path}/Content/IT/Memos`,
        oDataOptions: {
          select: ['DisplayName', 'Description', 'CreationDate', 'CreatedBy', 'ModificationDate'] as any,
          orderby: [['ModificationDate', 'desc']],
          expand: ['CreatedBy'] as string[],
        },
      })

      setData(result.d.results)
    }
    loadMemos()
  }, [repo])

  const handleChangeExpand: any = (panel: string) => (/* event: React.ChangeEvent<{}>,  */ isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleEditmode: any = (panel: string) => (/* event: React.ChangeEvent<{}>, */ isEditmode: boolean) => {
    console.log(editmode)
    setEditmode(isEditmode ? panel : false)
  }

  const handleSubmit: any = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(event.currentTarget.value)
  }

  const handleChange: any = (panel: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`${panel}-${event.target.value}`)
  }

  return (
    <div className={classes.root}>
      {data.map(memo => (
        <ExpansionPanel
          key={memo.Id}
          expanded={expanded === memo.Id.toString()}
          onChange={handleChangeExpand(memo.Id.toString())}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography className={classes.heading}>{memo.DisplayName}</Typography>
            <Typography className={classes.secondaryHeading}>
              {memo.CreatedBy ? (memo.CreatedBy as User).FullName : ''} -{' '}
              {moment(new Date(memo.CreationDate ? memo.CreationDate : '')).format('YYYY-MM-DD HH:mm:ss')} -{' '}
              {moment(new Date(memo.ModificationDate ? memo.ModificationDate : '')).format('YYYY-MM-DD HH:mm:ss')}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container>
              <Grid item xs={12}>
                <ReactMarkdown source={memo.Description} />
                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <TextField
                    style={{ width: '100%' }}
                    placeholder="Please write a memo..."
                    multiline={true}
                    value={memo.Description}
                    onChange={handleChange(memo.Id.toString())}
                    rows={2}
                    rowsMax={10}
                    id={memo.Id.toString()}
                  />
                </form>
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'right' }}>
                <Fab color="secondary" aria-label="Edit" size={'small'} className={classes.fab}>
                  <EditIcon onClick={handleEditmode(memo.Id.toString())} />
                </Fab>
                <Fab aria-label="Delete" size={'small'} className={classes.fab}>
                  <DeleteIcon />
                </Fab>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  )
}
