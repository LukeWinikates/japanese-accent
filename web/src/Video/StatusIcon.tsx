import CreateIcon from '@mui/icons-material/Create';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';

import {VideoStatus} from '../App/api';

export function StatusIcon({status}: { status: VideoStatus }) {
  switch (status) {
    case "Pending":
      return <CloudUploadIcon/>;
    case "Imported":
      return <CreateIcon/>;
    case "Complete":
      return <HeadsetMicIcon/>;
  }
}