import CreateIcon from '@material-ui/icons/Create';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
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