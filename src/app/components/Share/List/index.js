import React, { useEffect, useState } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import BootstrapDialog, { BootstrapDialogTitle } from '../../BootstrapDialog';
import Link from 'next/link';
import { 
  Container, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Pagination, 
  DialogContent, 
  DialogActions, 
  Button, 
  Skeleton, 
  ListItemSecondaryAction,
  LinearProgress 
} from '@mui/material';
import dayjs from 'dayjs';
import NoData from '../../NoData';
import { fetch  } from '../../../../utils';

const pageSize = 10;

export const getShareLink = (item) => {
  return `${window.location.origin}/s/${item.sid}?password=${item.password}`;
}

const ShareList = ({ open, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [currentDelete, setCurrentDelete] = useState('');

  const fetchData = async (pageIndex, pageSize) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/share/list?pageIndex=${pageIndex}&pageSize=${pageSize}`);
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(pageIndex, pageSize);
  }, [pageIndex]);

  const handlePageChange = (event, value) => {
    setPageIndex(value);
  };

  const handleDelete = React.useCallback((sid) => {
    setCurrentDelete(sid);
    fetch(`/api/share?sid=${sid}`, {
      method: 'DELETE',
    }).finally(() => {
      setCurrentDelete('');
      fetchData(pageIndex, pageSize);
    });

  }, [pageIndex]);

  return (
    <BootstrapDialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <BootstrapDialogTitle onClose={onClose}>
        <ShareIcon /> 分享列表
      </BootstrapDialogTitle>
      <DialogContent>
        <Container>
          <div>
            {loading ? <LinearProgress color='secondary' /> : null}
          </div>
          {!loading && data ?  (
            <>
              {!data.items || !data.items.length ? (
                <NoData />
              ) : null}
              <List>
                {data.items.map((item) => (
                  <div key={item.id}>
                    <ListItem>
                      <ListItemText 
                        primary={`笔记: ${item.notes[0]?.name}`} 
                        secondary={(
                          <>
                            <p>分享链接: <Link target='_blank' style={{textDecoration: 'underline'}} type='link' href={getShareLink(item)}>{getShareLink(item)}</Link></p>
                            <p>
                              <span>可公开访问：{item.public ? '是' : '否'}</span> | 
                              <span>查看次数: {item.accessCount}</span> | 
                              <span>创建时间：{dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span> |
                              <span>过期时间：{!item.expiredAt ? '永久有效' : dayjs(item.expiredAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                            </p>
                          </>
                        )} 
                      />
                      <ListItemSecondaryAction>
                        <Button disabled={currentDelete === item.sid} onClick={_ => handleDelete(item.sid)}>删除</Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
              <Pagination
                count={Math.ceil(data.total / pageSize)}  // Assuming pageSize is always 1
                page={pageIndex}
                onChange={handlePageChange}
                disabled={loading}
                variant="outlined"
                shape="rounded"
              />
            </>
          ) : (
            <>
              <Skeleton width='100%' />
              <Skeleton width='100%' />
              <Skeleton width='100%' />
            </>
          )}
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default ShareList;