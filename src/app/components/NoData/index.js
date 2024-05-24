import React from "react";

import EmptyIcon from '@mui/icons-material/HourglassEmpty';

export default function NoData() {
  return (
    <div style={{ textAlign: 'center' }}>
      <EmptyIcon style={{ position: 'relative', top: 5, color: '#999' }} /> 无数据
    </div>
  );
}