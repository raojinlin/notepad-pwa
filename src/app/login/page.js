'use client'
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import commonStyles from '../components/Notepad/notepad.module.css'
import { Alert, CircularProgress } from '@mui/material';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('请填写用户名和密码');
      return;
    }

    setError('');
    try {
      setLoading(true);
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      setLoading(false);
      window.location.href = '/';
    } catch (error) {
      console.error('登录失败：', error);
    }
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
          {error ? <div><Alert severity="error">{error}</Alert></div> : null}
          <form onSubmit={handleSubmit}>
            <TextField
              label="用户名"
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
                登录
                {loading ? <CircularProgress style={{width: 14, height: 14, marginLeft: 10}} /> : null}
              </Button>
            </div>
          </form>
        </Grid>
      </Grid>
    </div>
  );
}

export default LoginForm;
