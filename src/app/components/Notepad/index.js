'use client'
import React from 'react'
import {
  Dialog,
  Button,
  Checkbox,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControlLabel,
  ListItemButton, List, CircularProgress, Box, Tooltip, Popover
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckIcon from '@mui/icons-material/Check';
import BackupIcon from '@mui/icons-material/Backup';
import CloudIcon from '@mui/icons-material/Cloud';
import StorageIcon from '@mui/icons-material/Storage';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningIcon from '@mui/icons-material/Warning';
import ShareIcon from '@mui/icons-material/Share';
import ShareList from '../Share/List';
import DeleteConfirmDialog from './DeleteConfirmDialog';

import styles from './notepad.module.css';
import CloudNote from '../CloudNote';
import { DataStorage, SettingStorage, CurrentNoteStorage, now, guid } from './utils';
import Share from '../Share/Setting';
import Link from 'next/link';


const dataStorage = new DataStorage();
const currNoteStorage = new CurrentNoteStorage();
const settingStorage = new SettingStorage();

const debounce = (func, timeout) => {
  let t;
  return (...args) => {
    if (t) {
      clearTimeout(t);
    }

    t = setTimeout(() => {
      func(...args);
    }, timeout)
  };
};

const defaultEndpoint = {
  delete: '/api/notepad',
  upsert: '/api/notepad',
  query: '/api/notepad',
}


export default function Notepad({ endpoint=defaultEndpoint }) {
  const [data, setData] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);
  const [uploaded, setUploaded] = React.useState(false);
  const [setting, setSetting] = React.useState({});
  const [cloudNoteOpen, setCloudNoteOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [shareNoteID, setShareNoteID] = React.useState();
  const [showShareList, setShowShareList] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    setData(dataStorage.get() || []);
    setSetting(settingStorage.get() || []);
  }, []);

  const handleDataChange = React.useCallback(newData => {
    setData(newData);
    dataStorage.set(newData);
  }, []);


  const handleSettingChange = React.useCallback((key, value) => {
    const newSetting = {...setting, [key]: value};
    setSetting(newSetting);
    settingStorage.set(newSetting);
  }, [setting]);

  const [current, setCurrent] = React.useState(currNoteStorage.get() || (data?.length ? data[0]?.noteID : ''));

  React.useEffect(() => {
    currNoteStorage.set(current);
    setUploaded(false);
  }, [current]);

  const fetcher = React.useRef(debounce((val, current, data) => {
    return fetch(endpoint.upsert, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(val || data.find(it => it.noteID === current))
    }).then(r => {
      setSyncing(false);
      setUploaded(true);
    });
  }, 1000));

  const handleUpload = React.useCallback((val) => {
    setSyncing(true);
    fetcher.current(val, current, data);
  }, [current, data]);


  const handleNameChange = React.useCallback((i, value) => {
    const newData = [...data];
    const index = newData.findIndex(it => it.noteID === i);
    newData[index] = {
      ...newData[index],
      name: value,
      lastUpdateAt: Date.now(),
    }
    handleDataChange(newData);
    if (setting.autoSync) {
      handleUpload(newData[index]);
    }
  }, [data, setting, handleUpload, handleDataChange]);

  const handleNoteChange = React.useCallback((e) => {
    const newData = [...data];
    const index = newData.findIndex(it => it.noteID === current);
    newData[index] = {
      ...newData[index],
      lastUpdateAt: Date.now(),
      content: e.target.value
    };

    handleDataChange(newData.sort((a, b) => b.lastUpdateAt - a.lastUpdateAt));
    if (setting.autoSync) {
      handleUpload(newData[index]);
    }
  }, [data, current, setting, handleDataChange, handleUpload]);

  const handleNew = React.useCallback(() => {
    const newData = [{noteID: guid(), content: '', name: now(), createAt: Date.now(), lastUpdateAt: Date.now()}, ...data]
    setCurrent(newData[0].noteID);
    handleDataChange(newData);
    handleUpload(newData[0]);
  }, [data, handleUpload, handleDataChange]);

  const handleDeleteConfirm = React.useCallback(current => {
    setDeleteItem(current);
  }, []);

  const handleDelete = React.useCallback((current, deleteCloud) => {
    const currIndex = data.findIndex(it => it.noteID === current);
    const newData = data.filter(it => it.noteID !== current);
    handleDataChange(newData);

    if (currIndex-1 >= 0) {
      setCurrent(newData[currIndex-1]?.noteID);
    } else {
      setCurrent(newData[currIndex+1]?.noteID);
    }

    if (deleteCloud || setting.autoSync) {
      setDeleting(true);
      fetch(endpoint.delete + '?noteID=' + current, {
        method: 'DELETE'
      }).then(r => {
        console.log(r);
      }).catch(err => {
        console.error(err);
      }).finally(() => {
        setDeleteItem(null);
        setDeleting(false);
      });
    } else {
      setDeleteItem(null);
    }
  }, [data, setting, endpoint, handleDataChange]);

  const handleDownloadCurrent = React.useCallback((current) => {
    const note = data.find(it => it.noteID === current);
    if (!note) return;
    const blob = new Blob(note?.content.split(''), {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.visibility = 'hidden';
    a.href = url;
    a.download = `note-${note.name.replace(/:| |-/g, '_')}.txt`;
    a.click();
    document.body.append(a);
    a.remove();
    URL.revokeObjectURL(url);
  }, [data]);

  const handleNoteExport = React.useCallback(note => {
    const newData = [...data];
    const i = newData.findIndex(it => it.noteID === note.noteID);
    if (i === -1) {
      // 追加
      newData.push(note);
    } else {
      // 覆盖
      newData[i] = note;
    }
    setData(newData);
    setCurrent(note.noteID);
    handleDataChange(newData);
  }, [data, handleDataChange]);

  const handleNoteShare = React.useCallback(noteId => {
    setShareOpen(true);
    setShareNoteID(noteId);
  }, []);

  const getCurrent = () => data.find(it => it.noteID === current);

  const editorRef = React.useRef();
  const handleToEditor = React.useCallback((e) => {
    if (!editorRef.current) {
      return;
    }

    if (e.code === 'ArrowRight' && !(e.nativeEvent.target instanceof HTMLInputElement)) {
      editorRef.current.focus();
      return;
    }

    if (controlKeyDownRef.current && e.key === 'l') {
      editorRef.current.focus();
    }

  }, []);

  const controlKeyDownRef = React.useRef(false);
  const handleSwitch = React.useCallback((e) => {
    if (e.key === 'Control') {
      controlKeyDownRef.current = true;
    }

    handleToEditor(e);
    let moveDown = e.code === 'ArrowDown';
    // Up: control + p
    // Down: control + n
    if (controlKeyDownRef.current) {
      if (!['n', 'p'].includes(e.key)) {
        return;
      }

      moveDown = e.key === 'n';
    } else if (!['ArrowDown', 'ArrowUp'].includes(e.code)) {
      return;
    }

    e.preventDefault();
    const currIndex = data.findIndex(it => it.noteID === current);
    let nextIndex;
    if (moveDown) {
      nextIndex = Math.min(currIndex + 1, data.length);
      if (nextIndex === data.length) {
        nextIndex = 0;
      }
    } else {
      nextIndex = currIndex - 1;
      if (nextIndex < 0) {
        nextIndex = data.length - 1;
      }
    }

    setCurrent(data[nextIndex]?.noteID);
  }, [data, handleToEditor, current]);

  const handleControlKeyup = React.useCallback(e => {
    if (e.key === 'Control') {
      controlKeyDownRef.current = false;
    }
  }, []);

  return (
    <div className={styles.notepad}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>Notepad</h3>
        </div>
        <div className={styles.toolbar}>
          <Box className={styles.tools} sx={{'& .MuiSvgIcon-root': {marginRight: '5px'}}}>
            <Button type='button' variant='text' onClick={handleNew}><AddIcon /> 新建笔记</Button>
            <Button type='button' variant='text' onClick={_ => setCloudNoteOpen(true)}>
              <CloudIcon style={{marginRight: '5px'}} /> 云笔记
            </Button>
            <Button type='button' variant='text' onClick={_ => setShowShareList(true)}>
              <ShareIcon style={{marginRight: '5px'}} /> 分享列表
            </Button>
            <Button
              className={styles.mobileView}
              type='button'
              variant='text'
              onClick={_ => setDialogOpen(true)}
            >
              <StorageIcon /> 本地笔记
            </Button>
            <Button type='button' variant='text' onClick={_ => handleDownloadCurrent(current)} disabled={!current}>
              <DownloadIcon style={{position: 'relative', top: '1px'}} />下载
            </Button>
            <Button type='button' variant='text' onClick={_ => handleUpload()} disabled={syncing || !current}>
              <BackupIcon style={{marginRight: '5px'}} />上传
            </Button>
            <FormControlLabel
              label={'自动上传'}
              control={
                <Checkbox
                  checked={setting.autoSync || false}
                  onChange={(_, checked) => handleSettingChange('autoSync', checked)}
                  style={{
                    color: '#fff'
                  }}
                />
              }
            />
            <span className={styles.proc}>
              {getCurrent()?.createAt ? (<span className={styles.lastUpdate}>修改日期: {now(getCurrent().lastUpdateAt)}</span>) : null}
              {syncing ?
                <CircularProgress className={styles.loading} color="success" /> :
                uploaded ? <CheckIcon className={styles.loading} /> : null
              }
            </span>

          </Box>
          <div className={styles.options}>
            <div style={{lineHeight: '42px'}}>
              <div><Link href={'/logout'}><LogoutIcon style={{position: 'relative', top: '7px', marginRight: '5px'}} />注销</Link></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <ul onKeyDown={handleSwitch} onKeyUp={handleControlKeyup} tabIndex={0}>
          {data.map((item, i) => {
            return (
              <li
                tabIndex={i}
                key={item.noteID}
                id={item.noteID}
                onFocus={_ => setCurrent(item.noteID)}
                className={current === item.noteID && styles.current || ''}
              >
                <div>
                  {current === item.noteID ?
                    <input
                      type='text'
                      onChange={e => handleNameChange(item.noteID, e.target.value)}
                      onFocus={(e) => {
                        setCurrent(item.noteID);
                      }}
                      value={item.name}
                    /> :
                    <span className={styles.noteName}>{item.name}</span>
                  }
                </div>
                <div className={styles.itemToolbar}>
                  <a href='javascript:;' onClick={_ => handleNoteShare(item.noteID)}>
                    <Tooltip title='分享'>
                      <ShareIcon />
                    </Tooltip>
                  </a>
                  <a href='javascript:;' onClick={_ => handleDeleteConfirm(item.noteID)}>
                    <Tooltip title='删除'>
                      <DeleteForeverIcon />
                    </Tooltip>
                  </a>
                  <a href='javascript:;' onClick={_ => handleDownloadCurrent(item.noteID)}>
                     <Tooltip title={'下载笔记'}>
                       <DownloadIcon />
                     </Tooltip>
                  </a>
                </div>
              </li>
            )
          })}
        </ul>
        <div className={styles.textarea}>
          <Box
            sx={{
              '& .MuiSvgIcon-root': {
                color: 'yellowgreen',
                position: 'relative',
                top: 5,
                marginRight: '5px'
              },
              '&': {
                height: '100%'
              }
            }}
          >
            {data.length === 0 ? (
              <div className={styles.warning}>
                <WarningIcon />
                还有没添加笔记，<a href='javascript:;' onClick={handleNew}>新建一个吧</a>。
              </div>
            ) : (
              <textarea
                ref={editorRef}
                onFocus={_ => setCurrent(current)}
                disabled={data.length === 0 || current < 0}
                value={data ? data.find(it => it.noteID === current)?.content : '' || ''}
                onChange={handleNoteChange}
              />
            )}
          </Box>
        </div>
      </div>
      <Dialog
        open={dialogOpen}
        onClose={_ => setDialogOpen(false)}
        sx={{
          '& .MuiSvgIcon-root': {
            position: 'relative',
            top: '3px',
          }
        }}
      >
        <DialogTitle><StorageIcon /> 本地笔记</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <List>
              {data.map(it => {
                return (
                  <ListItemButton
                    selected={it.noteID === current}
                    sx={{minWidth: '300px', maxWidth: '500px'}}
                    key={it.noteID}
                    onClick={_ => {
                      setCurrent(it.noteID);
                      setDialogOpen(false);
                    }}
                  >
                    {it.name}
                  </ListItemButton>
                )
              })}
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={_ => setDialogOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
      <CloudNote endpoint={endpoint} open={cloudNoteOpen} onClose={setCloudNoteOpen} onChange={handleNoteExport} />
      <DeleteConfirmDialog
        open={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
        onConfirm={(deleteCloud) => handleDelete(deleteItem, deleteCloud)}
        loading={deleting}
      />
      <Share
        open={shareOpen}
        onClose={_ => {
          setShareOpen(false);
          setShareNoteID(0);
        }}
        noteID={shareNoteID}
      />
      {showShareList ? (
        <ShareList open onClose={() => setShowShareList(false)} />
      ) : null}
    </div>
  );
}
