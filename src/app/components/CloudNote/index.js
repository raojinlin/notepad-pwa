import * as React from 'react';
import styles from './index.module.css';

import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudIcon from '@mui/icons-material/Cloud';
import BootstrapDialog, { BootstrapDialogTitle } from '../BootstrapDialog';
import {ListItemButton, Skeleton, List} from "@mui/material";
import NoData from '../NoData';
import {now} from "../Notepad/utils";
import { fetch } from '../../../utils';


export default function CloudNote({ open: isOpen, onChange, onClose, endpoint={} }) {
  const [open, setOpen] = React.useState(isOpen);
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [deletingID, setDeletingID] = React.useState(0);

  const refreshNotes = React.useCallback(() => {
    setLoading(true);
    fetch(endpoint.query).then(r => {
      return r.json();
    }).then(r => {
      setNotes(r);
      setLoading(false);
    });
  }, [endpoint]);

  React.useEffect(() => {
    setOpen(isOpen);
    if (!isOpen) {
      return;
    }

    refreshNotes();
  }, [isOpen, refreshNotes]);

  const handleDelete = React.useCallback((id) => {
    setDeletingID(id);
    fetch(`${endpoint.delete}?id=${id}`, {method: 'DELETE'}).then(r => {
      setDeletingID(0);
      return refreshNotes();
    })
  }, [endpoint, refreshNotes]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    if (onClose) {
      onClose(false);
    }
  }, [onClose]);

  const handleChange = React.useCallback(note => {
    handleClose();
    onChange(note);
  }, [onChange, handleClose]);

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <CloudIcon /> 云笔记
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {loading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <List style={{maxWidth: '500px', minWidth: '400px'}}>
              {!notes || notes.length === 0 ? (
                <NoData />
              ) : null}
              {notes.map(note => (
                <ListItemButton key={note.id}>
                  <div className={styles.noteRow}>
                    <div style={{flex: 1}}>{note.name}</div>
                    <div>
                      <span className={styles.createTime}>
                        {now(note.lastUpdateAt)}
                      </span>
                      <Button className={styles.action} onClick={_ => handleChange(note)}>
                        <DownloadIcon />
                      </Button>
                      <Button className={styles.action} onClick={_ => handleDelete(note.id)} disabled={note.id === deletingID}>
                        <DeleteIcon />
                      </Button>
                    </div>
                  </div>
                </ListItemButton>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
             关闭
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
