import {Video} from "../../App/api";
import React, {useEffect, useState} from "react";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {Container, IconButton, makeStyles, Paper, Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => (
  {
    buttonContainer: {
      textAlign: "right"
    },
    root: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
      backgroundColor: theme.palette.grey.A100
    }
  }
));

const CopyableText = ({text}: { text: string }) => {

  const classes = useStyles();
  const [feedback, setFeedback] = useState(false);
  const showCopiedFeedback = () => {
    setFeedback(true)
  }
  const copy = () => {
    navigator.clipboard.writeText(text).then(showCopiedFeedback)
  }

  useEffect(() => {
    if (!feedback) {
      return
    }
    const timer = setTimeout(() => {
      setFeedback(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [feedback])

  return (
    <Paper className={classes.root}>
      <div>
        <pre>
        %&gt; {text}
          </pre>
      </div>
      <div className={classes.buttonContainer}>
        {
          feedback && <Typography variant="body2" component="span">copied!</Typography>
        }
        <IconButton color="default" aria-label="copy to clipboard" onClick={copy}>
          <FileCopyIcon/>
        </IconButton>
      </div>
    </Paper>
  );
}

export const PendingYouTubeVideo = ({video}: { video: Video }) => {
  let youtubeDLCommandText = "youtube-dl --write-auto-sub -f m4a \\\n\t" +
    "-o '%(id)s.%(ext)s' -k --sub-lang ja \\\n\t" +
      `https://www.youtube.com/watch?v=${video.videoId}`;

  return (
    <Container maxWidth='sm'>
      <h3>Here are instructions on how to load video: {video.title}</h3>

      <CopyableText
        text="cd ~/Library/Application\ Support/japanese-accent/data/media/"/>
      <CopyableText
        text={youtubeDLCommandText}/>
    </Container>
  );
};
