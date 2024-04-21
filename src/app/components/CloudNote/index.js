import * as React from 'react';

import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DownloadIcon from '@mui/icons-material/Download';
import CloudIcon from '@mui/icons-material/Cloud';
import BootstrapDialog, { BootstrapDialogTitle } from '../BootstrapDialog';
import {ListItemButton, Skeleton, List} from "@mui/material";

import {now} from "@/app/components/Notepad/utils";


export default function CloudNote({ open: isOpen, onChange, onClose, endpoint={} }) {
  const [open, setOpen] = React.useState(isOpen);
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setOpen(isOpen);
    if (!isOpen) {
      return;
    }

    setLoading(true);
    fetch(endpoint.query).then(r => r.json()).then(r => {
      setNotes(r);
      setLoading(false);
    });
  }, [isOpen, endpoint]);

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
            <List>
              {notes.map(note => (
                <ListItemButton style={{width: '500px'}} key={note.id}>
                  <div style={{display: 'flex', width: '100%'}}>
                    <div style={{flex: 1}}>{note.name}</div>
                    <div>
                      <span style={{verticalAlign: 'top', fontSize: '14px', marginRight: '15px'}}>
                        {now(note.lastUpdateAt)}
                      </span>
                      <DownloadIcon onClick={_ => handleChange(note)} style={{color: '#655965'}} />
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
