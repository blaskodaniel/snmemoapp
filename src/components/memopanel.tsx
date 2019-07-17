import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import moment from 'moment'
import Fab from '@material-ui/core/Fab'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import RedoIcon from '@material-ui/icons/Redo'
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
import { DialogComponent } from '../components/dialog'

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    hidden: {
      display: 'none',
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
  const [editmode, setEditmode] = useState<string | false>('')
  const [editText, setEditText] = useState<string>('')
  const [openmodal, setOpenmodal] = useState<boolean>(false)
  const [modaltitle, setModaltitle] = useState<string>('')
  const [currentmemo, setCurrentmemo] = useState<GenericContent>(null as any)
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

  // Remove memo - open modal
  const deleteOpenModal = (memo: GenericContent) => {
    setCurrentmemo(memo) // set current content for removing
    const title = memo.DisplayName ? memo.DisplayName : ''
    setModaltitle(title)
    setOpenmodal(true)
  }

  // Remove memo - remove content
  const deleteMemoContent = async (receivebtn: boolean) => {
    if (receivebtn) {
      // User clicked "Yes"
      const newdata = data.filter(x => x.Id != currentmemo.Id)
      await repo.delete({
        idOrPath: currentmemo.Path,
        permanent: true,
      })
      setData(newdata) // refresh memo list
      setOpenmodal(false) // close modal window
    } else {
      // User clicked "No"
      setOpenmodal(false)
    }
  }

  // Expansion panel handler
  const handleChangeExpand: any = (panel: string) => (_event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
    console.log(expanded)
  }

  // Edit/Read mode handler
  const handleEditmode: any = (memo: GenericContent) => () => {
    setEditmode(memo.Id.toString())
    setEditText(memo.Description ? memo.Description : '')
    console.log(editmode)
  }

  // Save handler
  const handleSave: any = async (memo: GenericContent) => {
    const newDescrition = {
      Description: editText,
    }
    await repo.patch({
      idOrPath: memo.Id,
      content: newDescrition,
    })
    data.map(x => {
      if (x.Id === memo.Id) {
        x.Description = editText
      }
    })
    setData(data)
    setEditmode(false)
    console.log('Save successfuly')
  }

  // Text change handler in edit mode
  const handleChange: any = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value)
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
              {moment(new Date(memo.CreationDate ? memo.CreationDate : '')).format('YYYY-MM-DD HH:mm:ss')}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container>
              <Grid item xs={12}>
                <ReactMarkdown
                  source={memo.Description}
                  className={editmode === memo.Id.toString() ? classes.hidden : ''}
                />
                <TextField
                  style={{ width: '100%', display: editmode === memo.Id.toString() ? 'block' : 'none' }}
                  placeholder="Write a memo..."
                  multiline={true}
                  value={editText}
                  onChange={handleChange(memo.Id.toString())}
                  rows={1}
                  rowsMax={10}
                  id={memo.Id.toString()}
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'right' }}>
                <Fab
                  color="secondary"
                  aria-label="Edit"
                  size={'small'}
                  className={editmode === memo.Id.toString() ? classes.hidden : classes.fab}>
                  <EditIcon onClick={handleEditmode(memo)} />
                </Fab>
                <Fab
                  aria-label="Delete"
                  size={'small'}
                  onClick={() => deleteOpenModal(memo)}
                  className={editmode === memo.Id.toString() ? classes.hidden : classes.fab}>
                  <DeleteIcon />
                </Fab>
                <Fab
                  aria-label="Save"
                  size={'small'}
                  onClick={() => handleSave(memo)}
                  className={editmode === memo.Id.toString() ? classes.fab : classes.hidden}>
                  <SaveIcon />
                </Fab>
                <Fab
                  aria-label="Cancel"
                  size={'small'}
                  onClick={() => {
                    setEditmode(false)
                  }}
                  className={editmode === memo.Id.toString() ? classes.fab : classes.hidden}>
                  <RedoIcon />
                </Fab>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
      <DialogComponent
        open={openmodal}
        title={modaltitle}
        onClose={receivebtn => {
          deleteMemoContent(receivebtn)
        }}
      />
    </div>
  )
}
