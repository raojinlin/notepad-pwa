'use client'
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import commonStyles from '../components/Notepad/notepad.module.css'
import { Alert, CircularProgress, Typography } from '@mui/material';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('请填写完整注册信息');
      return;
    }

    (async () => {
      setError('');
      try {
        setLoading(true);
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name }),
          });
          
          if (response.status === 404) {
            setError('邮箱或密码错误');
            setLoading(false);
            return;
          }

          if (response.status === 401) {
            setError('系统不可注册');
            setLoading(false);
            return;
          }

          const data = await response.json();
          if (data.message) {
            if (data.message.includes('already exists')) {
              setError('邮箱已被注册');
              setLoading(false);
              return;
            }
          }
          setLoading(false);
          window.location.href = '/login';
      } catch (error) {
        console.error('登录失败：', error);
      }
    })();
  };

  return (
    <div>
      <div className={commonStyles.header}>
        <div style={{width: '80%', margin: 'auto'}}>
          <h3>Notepad - 笔记</h3>
        </div>
      </div>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: 'calc(100vh - 100px)'}}
      > 
        <Grid item xs={12}>
          <Typography variant='h5'>注册账号</Typography>
          {error ? <div><Alert severity="error">{error}</Alert></div> : null}
          <form onSubmit={handleSubmit}> 
            <TextField
              label="名称"
              variant="outlined"
              value={name}
              size='small'
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="邮箱"
              variant="outlined"
              value={email}
              size='small'
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="密码"
              variant="outlined"
              type="password"
              size='small'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <div style={{textAlign: 'right'}}>
              <Button disabled={loading} type="submit" variant="contained" color="primary">
                注册
                {loading ? <CircularProgress style={{width: 14, height: 14, marginLeft: 10}} /> : null}
              </Button>
            </div>
          </form>
        </Grid>
      </Grid>
    </div>
  );
}

export default RegisterForm;