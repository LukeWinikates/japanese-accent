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
  makeStyles,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {Loadable} from "../App/loadable";
import {useFetch} from "use-http";
import {AppSettings} from "../App/api"
import {useServerInteractionHistory} from "./useServerInteractionHistory";

const useStyles = makeStyles(theme => (
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
  const classes = useStyles();
  const [apiKey, setApiKeyData] = useState<Loadable<string>>("loading");
  const [showApiKey, setShowApiKey] = useState(false);
  const setApiKey = (key: string) => {
    setApiKeyData({
      data: key
    })
  }

  const {logError} = useServerInteractionHistory();

  const settingsApi = useFetch("api/application-settings")
  const refreshMetricsApi = useFetch("api/debug/refresh-metrics")

  useEffect(() => {
    settingsApi.get().then((settings: AppSettings) => {
      setApiKey(
        settings.forvoApiKey
      )
    });
  }, [])

  const refreshMetrics = () => {
    refreshMetricsApi.post().catch(logError);
  }

  const saveForvoApiKey = () => {
    if (apiKey === "loading") {
      return;
    }
    settingsApi.post({
      forvoApiKey: apiKey.data
    }).catch(logError)
  }

  // loading of the settings panel
  // use loadable -> if we have loaded the settings, render the settings panel

  let handleApiKeyChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setApiKey(e.target.value)
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
        <IconButton aria-label="close" onClick={onClose} className={classes.closeButton}>
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
                        >
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
