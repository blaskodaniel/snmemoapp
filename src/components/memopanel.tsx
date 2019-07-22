import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import moment from 'moment'
import Fab from '@material-ui/core/Fab'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import AddIcon from '@material-ui/icons/Add'
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
import { NewMemoI } from '../interfaces'
import { AddNew } from './addnewmemo'

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
    fabAdd: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
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
  const [addpanelshow, setAddpanelshow] = useState<boolean>(false)
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

  // Create new memo handler
  const handleAddNew: any = async (memocnt: NewMemoI) => {
    const created = await repo.post({
      contentType: 'Memo',
      parentPath: '/Root/Content/IT/Memos/',
      oDataOptions: {
        select: ['DisplayName', 'Description', 'CreationDate', 'CreatedBy', 'ModificationDate'] as any,
        expand: ['CreatedBy'] as string[],
      },
      content: memocnt,
    })
    const newList = [...data, created.d]
    newList.sort((a, b) => {
      const bDate = new Date(b.ModificationDate ? b.ModificationDate : '').getTime()
      const aDate = new Date(a.ModificationDate ? a.ModificationDate : '').getTime()
      return aDate < bDate ? 1 : -1
    })
    setData(newList)
    setAddpanelshow(false)
  }

  // Expansion panel handler
  const handleChangeExpand: any = (panel: string) => (_event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  // Edit/Read mode handler
  const handleEditmode: any = (memo: GenericContent) => () => {
    setEditmode(memo.Id.toString())
    setEditText(memo.Description ? memo.Description : '')
  }

  // Save handler
  const handleSave: any = async (memo: GenericContent) => {
    const newDescrition = {
      Description: editText,
    }
    const editedMemo = await repo.patch({
      idOrPath: memo.Id,
      content: newDescrition,
      oDataOptions: {
        select: ['DisplayName', 'Description', 'CreationDate', 'CreatedBy', 'ModificationDate'] as any,
        expand: ['CreatedBy'] as string[],
      },
    })

    const newlist = data.map(x => {
      if (x.Id === memo.Id) {
        return editedMemo.d
      } else {
        return x
      }
    })

    newlist.sort((a, b) => {
      const bDate = new Date(b.ModificationDate ? b.ModificationDate : '').getTime()
      const aDate = new Date(a.ModificationDate ? a.ModificationDate : '').getTime()
      return aDate < bDate ? 1 : -1
    })

    setData(newlist)
    setEditmode(false)
  }

  // Text change handler in edit mode
  const handleChange: any = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value)
  }

  return (
    <div className={classes.root}>
      <AddNew
        show={addpanelshow}
        onCreate={memo => {
          handleAddNew(memo)
        }}
        onClose={() => setAddpanelshow(false)}
      />
      {data.map(memo => (
        <ExpansionPanel
          key={memo.Id}
          expanded={expanded === memo.Id.toString()}
          onChange={handleChangeExpand(memo.Id.toString())}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography className={classes.heading}>{memo.DisplayName}</Typography>
            <Typography className={classes.secondaryHeading}>
              Created by: {memo.CreatedBy ? (memo.CreatedBy as User).FullName : ''}{' '}
              {moment(new Date(memo.CreationDate ? memo.CreationDate : '')).format('dddd on DD-MM-YYYY')}{' '}
              <span style={{ fontStyle: 'italic' }}>
                (Modified:{' '}
                {moment(new Date(memo.ModificationDate ? memo.ModificationDate : '')).format('DD-MM-YYYY HH:mm:ss')})
              </span>
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
                  style={{ width: '100%', display: editmode === memo.Id.toString() ? 'inline-flex' : 'none' }}
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
      <Fab
        color="secondary"
        variant="extended"
        onClick={() => {
          setAddpanelshow(true)
          window.scrollTo(0, 0)
        }}
        aria-label="Add new"
        className={classes.fabAdd}>
        <AddIcon className={classes.extendedIcon} />
        Add new
      </Fab>
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
