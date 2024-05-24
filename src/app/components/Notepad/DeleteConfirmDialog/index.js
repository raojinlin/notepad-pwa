import React from "react";
import BootstrapDialog, { BootstrapDialogTitle } from '../../BootstrapDialog';
import { Button, DialogActions, DialogContent, Checkbox, FormControlLabel, LinearProgress } from "@mui/material";


export default function DeleteConfirmDialog({ onConfirm, open, onClose, showDeleteCloud=true, loading }) {
  const [deleteCloud, setDeleteCloud] = React.useState(false);

  const handleConfirm = React.useCallback(() => {
    onConfirm(deleteCloud);
  }, [onConfirm, deleteCloud]);
  return (
    <BootstrapDialog
      open={open}
      onClose={onClose}
      size='large'
      sx={{
        '.MuiPaper-root': {width: '500px'},
        '.MuiDialogContent-root': {padding: '0 25px'},
      }}
    >
      <BootstrapDialogTitle onClose={onClose}>
        确认删除笔记
      </BootstrapDialogTitle>
      <DialogContent>
        {loading ? <LinearProgress color="inherit" /> : null}
        {showDeleteCloud ? (
          <FormControlLabel
            control={<Checkbox checked={deleteCloud} onChange={e => setDeleteCloud(e.target.checked)} />}
            label='同时删除云笔记'
          />
        ) : <div>是否确认删除云笔记</div>}
      </DialogContent>
      <DialogActions>
        <Button size='small' onClick={onClose}>取消</Button>
        <Button disabled={loading} size='small' onClick={handleConfirm} color="warning" variant="contained">删除</Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
