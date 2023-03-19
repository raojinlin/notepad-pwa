import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import CloudIcon from '@mui/icons-material/Cloud';
import CloseIcon from '@mui/icons-material/Close';
import {ListItemButton, Skeleton, List} from "@mui/material";
import {now} from "@/app/components/Notepad/utils";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiSkeleton-text': {
    height: '38px',
    width: '500px',
  },
  '& .MuiDialogTitle-root .MuiSvgIcon-root': {
    position: 'relative',
    top: '3px',
    color: '#92869f',
  },
  '& .MuiListItemButton-root': {
    width: '500px',
  }
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs({ open: isOpen, onChange, onClose, endpoint={} }) {
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
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose(false);
    }
  };

  const handleChange = React.useCallback(note => {
    handleClose();
    onChange(note);
  }, [onChange]);

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
