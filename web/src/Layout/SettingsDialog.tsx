import React, {ChangeEvent, useCallback, useState} from "react";
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
import {useBackendAPI} from "../App/useBackendAPI";
import {AppSettings} from "../api/types";
import {Loader, Settable} from "../App/Loader";

const useStyles = makeStyles<{}>()(theme => (
  {
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }
));

function LoadedDialog({value, setValue}: Settable<AppSettings>) {
  const [showApiKey, setShowApiKey] = useState(false);
  const api = useBackendAPI();


  const saveForvoApiKey = useCallback(() => {
    return api.settings.PUT({
      forvoApiKey: value.forvoApiKey
    })
  }, [api.settings, value.forvoApiKey]);

  const saveExportPath = useCallback(() => {
    return api.settings.PUT({
      audioExportPath: value.audioExportPath
    })
  }, [api.settings, value.audioExportPath]);

  let handleApiKeyChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue({
      ...value,
      forvoApiKey: e.target.value
    })
  }, [value, setValue]);

  let handleAudioExportPathChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue({
      ...value,
      audioExportPath: e.target.value
    })
  }, [value, setValue]);

  const onToggleShowAPIKey = useCallback(() => {
    setShowApiKey(!showApiKey);
  }, [showApiKey, setShowApiKey]);

  return (
    <>
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
        <>
          <FormControl>
            <Input
              id="standard-adornment-password"
              type={showApiKey ? 'text' : 'password'}
              value={value.forvoApiKey}
              onChange={handleApiKeyChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onToggleShowAPIKey}
                    onMouseDown={onToggleShowAPIKey}
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
      </Box>

      <Divider/>
      <Box m={1}>
        <Typography variant="h5">
          Audio Export
        </Typography>
        <Typography variant="body1">
          Japanese Accent Practice can export audio practice files for playback on your mobile device or music player

        </Typography>

        <FormControl>
          <Input
            value={value.audioExportPath}
            onChange={handleAudioExportPathChange}
          />
        </FormControl>
        <Button onClick={saveExportPath}>
          Save
        </Button>

      </Box>

      <Divider/>
      <Box m={1}>
        <Typography variant="h5">
          Debug Tools
        </Typography>
        Playlists are generated based on your practice activity and Boosting of individual study items. Click here to
        refresh these metrics.
        <Button onClick={api.debug.refreshMetrics.POST}>
          Refresh Metrics
        </Button>
      </Box>
    </>
  );
}

export default function SettingsDialog({onClose}: { onClose: () => void }) {
  const {classes} = useStyles({});
  const api = useBackendAPI();

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
        <Loader callback={api.settings.GET} into={LoadedDialog}/>
      </DialogContent>
      <DialogActions>
        {/*<Button onClick={save} disabled={preview === null}>*/}
        {/*  Save*/}
        {/*</Button>*/}
      </DialogActions>
    </Dialog>
  );
}
