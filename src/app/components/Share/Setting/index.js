import React from "react";
import BootstrapDialog, { BootstrapDialogTitle } from "../../BootstrapDialog";
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ShareIcon from '@mui/icons-material/Share';
import Button from "@mui/material/Button";
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField, Typography, Snackbar, Alert, FormLabel } from "@mui/material";
import 'dayjs/locale/zh-cn';
import dayjs from "dayjs";
import Slide from '@mui/material/Slide';
import { getShareLink } from "../List";
import Link from "next/link";
import { randomID } from "../../../../utils";




export default function Share({ open: isOpen, onChange, onClose, noteID }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState({randomPassword: false, public: false, password: '', expiredAt: dayjs().add(7, 'day').unix()});
  const [loading, setLoading] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [error, setError] = React.useState('');
  const [shareLink, setShareLink] = React.useState('');

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    if (onClose) {
      onClose();
    } 
  }, [onClose]);

  const handlePublicChange = React.useCallback((publicAccess) => {
    setValue({...value, password: publicAccess ? '' : value.password, public: publicAccess, randomPassword: false})
  }, [value]);

  const handleRandomPassowrd = React.useCallback((random) => {
    if (!random) {
      setValue({...value, password: '', randomPassword: false});
    } else {
      setValue({...value, password: randomID(5), randomPassword: true, public: false});
    }
  }, [value]);

  const handleExpiredChange = React.useCallback((e) => {
    if (e.target.value === 'never') {
      setValue({...value, expiredAt: null});
    } else {
      const [val, unit] = e.target.value.split('-');
      setValue({...value, expiredAt: dayjs().add(val, unit).unix()})
    }
  }, [value]);

  const handleCreateShare = React.useCallback(() => {
    if (!value.password && !value.public) {
      setError('请设置访问密码')
      setShowError(true);
      return;
    }

    if (!noteID) {
      setError('没有选择要分享的笔记')
      setShowError(true);
      return;
    }

    setError('');
    setLoading(true);
    fetch(`/api/share`, {
      method: 'POST', 
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({...value, noteID})
    }).then(r => r.json()).then(r => {
      setLoading(false);
      console.log(r[0]);
      setShareLink(getShareLink(r[0]));
    })

  }, [value, noteID, handleClose]);

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showError}
        TransitionComponent={Slide}
        onClose={() => setShowError(false)}
        autoHideDuration={3000}
      >
        <Alert severity="warning" variant="filled" sx={{width: '100%'}}>{error}</Alert>
      </Snackbar>
      <BootstrapDialog 
        open={open} 
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
      >
        <BootstrapDialogTitle id="share-dialog-title" onClose={onClose}>
          <ShareIcon /> 分享笔记
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography variant="p">参数设置</Typography>
          {shareLink ? (
            <div style={{marginTop: 10}}>
              <Typography variant="p">分享链接已生成：</Typography>
              <Typography><Link color="revert" href={shareLink} target='_blank'>{shareLink}</Link></Typography>
            </div>
          ) : null}
          <div style={{width: 500}}>
            <FormControlLabel 
              label='公开访问' 
              checked={value.public} 
              control={<Checkbox />} 
              onChange={e => handlePublicChange(e.target.checked)}
            />
            <FormControlLabel 
              label='生成随机访问密码' 
              control={<Checkbox />} 
              checked={value.randomPassword} 
              onChange={e => handleRandomPassowrd(e.target.checked)} 
            />
            <TextField 
              fullWidth 
              margin="normal" 
              size="small" 
              required 
              label='访问密码' 
              disabled={value.public || value.randomPassword}
              type="text" 
              value={value.password}
              onChange={e => setValue({...value, password: e.target.value})}
            />
            <div style={{marginTop: 15, marginBottom: 10}}>
            </div>
            <FormControl fullWidth size="small">
              <InputLabel>有效期</InputLabel>
              <Select label='有效期' onChange={handleExpiredChange} defaultValue={'7-day'}>
                <MenuItem value='7-day'>7天</MenuItem>
                <MenuItem value='15-day'>15天</MenuItem>
                <MenuItem value='30-day'>30天</MenuItem>
                <MenuItem value='never'>永久有效</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>关闭</Button>
          <Button disabled={loading} onClick={handleCreateShare} style={{backgroundColor: '#92869f'}} variant="contained">创建分享</Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}