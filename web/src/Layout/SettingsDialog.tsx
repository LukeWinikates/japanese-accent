import React, {ChangeEvent, useEffect, useState} from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import CloseIcon from "@mui/icons-material/Close";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {Loadable} from "../App/loadable";
import {debugRefreshMetricsPOST} from "../api/ApiRoutes";
import {useBackendAPI} from "../App/useBackendAPI";

const useStyles = makeStyles()(theme => (
  {
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }
));

export default function SettingsDialog({onClose}: { onClose: () => void }) {
  const {classes} = useStyles();
  const api = useBackendAPI();

  const [apiKey, setApiKeyData] = useState<Loadable<string>>("loading");
  const [audioExportPath, setAudioExportPathData] = useState<Loadable<string>>("loading");
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    api.settings.GET()
      .then(({data: settings}) => {
        setApiKeyData({
          data: settings.forvoApiKey
        })
        setAudioExportPathData({
          data: settings.audioExportPath
        })
      });
  }, [setApiKeyData, setAudioExportPathData, api.settings])

  const refreshMetrics = () => {
    return debugRefreshMetricsPOST();
  }

  const saveForvoApiKey = () => {
    if (apiKey === "loading") {
      return;
    }
    return api.settings.PUT({
      forvoApiKey: apiKey.data
    })
  }

  const saveExportPath = () => {
    if (audioExportPath === "loading") {
      return;
    }
    return api.settings.PUT({
      audioExportPath: audioExportPath.data
    })
  }

  let handleApiKeyChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setApiKeyData({
      data: e.target.value
    })
  };

  let handleAudioExportPathChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAudioExportPathData({
      data: e.target.value
    })
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="simple-dialog-title">
        Application Settings
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={classes.closeButton}
          size="large">
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box m={1}>
          <Typography variant="h5">
            Forvo Integration
          </Typography>
          <Typography variant="body1">
            Japanese Accent Practice can use Forvo to find examples of native speakers pronouncing single Japanese
            words.
            To enable this feature, sign up at <Link href="https://forvo.com/">Forvo.com</Link>, and subscribe to their
            API plan, then copy your API token here.

          </Typography>

          {
            apiKey === "loading" ?
              <>loading...</> :
              <>
                <FormControl>
                  <Input
                    id="standard-adornment-password"
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey.data}
                    onChange={handleApiKeyChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowApiKey(!showApiKey)}
                          onMouseDown={() => setShowApiKey(!showApiKey)}
                          size="large">
                          {showApiKey ? <Visibility/> : <VisibilityOff/>}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Button onClick={saveForvoApiKey}>
                  Save
                </Button>
              </>
          }
        </Box>

        <Divider/>
        <Box m={1}>
          <Typography variant="h5">
            Audio Export
          </Typography>
          <Typography variant="body1">
            Japanese Accent Practice can export audio practice files for playback on your mobile device or music player

          </Typography>

          {
            audioExportPath === "loading" ?
              <>loading...</> :
              <>
                <FormControl>
                  <Input
                    value={audioExportPath.data}
                    onChange={handleAudioExportPathChange}
                  />
                </FormControl>
                <Button onClick={saveExportPath}>
                  Save
                </Button>
              </>
          }
        </Box>

        <Divider/>
        <Box m={1}>
          <Typography variant="h5">
            Debug Tools
          </Typography>
          Playlists are generated based on your practice activity and Boosting of individual study items. Click here to
          refresh these metrics.
          <Button onClick={refreshMetrics}>
            Refresh Metrics
          </Button>
        </Box>

      </DialogContent>
      <DialogActions>
        {/*<Button onClick={save} disabled={preview === null}>*/}
        {/*  Save*/}
        {/*</Button>*/}
      </DialogActions>
    </Dialog>
  );
}
