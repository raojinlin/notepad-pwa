'use client';

import React from "react";
import commonStyles from '../../Notepad/notepad.module.css';
import styles from "./index.module.css";
import WarningIcon from '@mui/icons-material/Warning';
import { Skeleton, TextField } from "@mui/material";
import { Button } from "@mui/material";
import dayjs from "dayjs";

const Notfound = () => {
  return (
    <div className={styles.notfound}>
      <div><WarningIcon /></div>
      <div>
        <h3>啊哦，你所访问的页面不存在了。</h3>
        <p>可能的原因: </p>
        <ol>
          <li>在地址栏中输入了错误的地址。</li>
          <li>你点击的某个链接已过期。</li>
        </ol>
      </div>
    </div>
  );
};

const AccessPassword = ({ onChange }) => {
  const [val, setVal] = React.useState('');

  const handleSubmit = React.useCallback(() => {
    if (onChange) {
      onChange(val);
    }
  }, [val, onChange]);

  return (
    <div className={styles.accessPassword}>
      <div>
        <TextField 
          value={val}
          fullWidth
          placeholder="请输入访问密码" 
          size="small" 
          label='访问密码' 
          type='password' 
          required 
          onChange={(e) => setVal(e.target.value.trim())} 
        />
      </div>
      <div className={styles.btnRow}>
        <Button variant="contained" onClick={handleSubmit} size="small">访问</Button>
      </div>
    </div>
  );
};

export default function Preview({ sid, password }) {
  const [share, setShare] = React.useState({});
  const [notFound, setNotFound] = React.useState(false);
  const [accessDenied, setAccessDenied] = React.useState(false);
  const [accessPassword, setAccessPassword] = React.useState(password || '');
  const [loading, setLoading] = React.useState(false);
  

  React.useEffect(() => {
    setLoading(true);
    const r = fetch(`/api/share/note?sid=${sid}&password=${accessPassword}`).then(s => {
      if (s.status === 200) {
        s.json().then(r => setShare(r));
      } else if (s.status === 404) {
        setNotFound(true);
      } else if (s.status === 403) {
        setAccessDenied(true);
      }
    }).catch(err => {
      console.log(err, r);
    }).finally(() => {
      setLoading(false);
    })
  }, [sid, accessPassword]);

  const handlePasswordChange = React.useCallback((pwd) => {
    if (!pwd) {
      return;
    }
    setAccessPassword(pwd);
    setAccessDenied(false);
  }, [])

  return (
    <div>
      <div className={commonStyles.header}>
        <div className={styles.title}>
          <h3>Notepad - 笔记分享</h3>
        </div>
      </div>
      <div className={styles.note}>
        {loading ? (
          <>
            <Skeleton variant="text" height={'50px'} />
            <Skeleton variant="text" height="30px" style={{marginBottom: '15px'}} width={'200px'} />
            {new Array(30).fill(1).map((_, i) => <Skeleton key={i} variant="text" height={'30px'} />)}
          </>
        ) : null}
        {notFound ? <Notfound /> : null}
        {accessDenied ? <AccessPassword onChange={handlePasswordChange} /> : null}

        {!loading && share?.id ? (
          <div className={styles.noteContent}>
            <h1>{share.note?.name}</h1>
            <p>过期时间：{share.expiredAt ? dayjs(share.expiredAt).format('YYYY-MM-DD HH:mm:ss') : '无'}</p>
            <pre>
              {share.note?.content}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}