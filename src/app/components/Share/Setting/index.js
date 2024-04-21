import React from "react";
import BootstrapDialog, { BootstrapDialogTitle } from "../../BootstrapDialog";
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ShareIcon from '@mui/icons-material/Share';
import Button from "@mui/material/Button";
import { zhCN } from "@mui/x-date-pickers/locales";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/zh-cn';



export default function Share({ open: isOpen, onChange, onClose }) {
  const [open, setOpen] = React.useState(false);
  const [accessPassword, setAccessPassword] = React.useState('');
  const [neverExpired, setNeverExpired] = React.useState(false);

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    if (onClose) {
      onClose();
    } 
  }, [onClose]);

  return (
    <div>
      <BootstrapDialog 
        open={open} 
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
      >
        <BootstrapDialogTitle id="share-dialog-title" onClose={onClose}>
          <ShareIcon /> 分享笔记
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div style={{width: 500}}>
            <TextField 
              fullWidth 
              margin="normal" 
              size="small" 
              required 
              label='访问密码' 
              type="password" 
              value={accessPassword}
              onChange={e => setAccessPassword(e.target.value)}
            />
            <div style={{marginTop: 15, marginBottom: 10}}>
              <LocalizationProvider 
                dateAdapter={AdapterDayjs}
                localeText={zhCN.components.MuiLocalizationProvider.defaultProps.localeText}
                adapterLocale="zh-cn"
              >
                <DateTimePicker 
                  disabled={neverExpired}
                  sx={{'& .MuiInputBase-input': {padding: '8.5px 14px'}, '& .MuiFormLabel-root': {top: '-6px'}}} 
                  label='过期时间' 
                  views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']} 
                />
              </LocalizationProvider>
              <FormControlLabel 
                style={{marginLeft: 5}} 
                checked={neverExpired} 
                onChange={e => setNeverExpired(e.target.checked)} 
                label='永久有效' 
                control={<Checkbox />} 
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={_ => setOpen(false)}>关闭</Button>
          <Button style={{backgroundColor: '#92869f'}} variant="contained">保存</Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}