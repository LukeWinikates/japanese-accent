import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {blue} from '@material-ui/core/colors';
import {duration, Segment} from "./api";

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

export interface MediaSegmentsEditDialogProps {
    open: boolean;
    // selectedValue: string;
    onClose: (value: string) => void;
    segments: Segment[];
}

export function MediaSegmentsEditDialog(props: MediaSegmentsEditDialogProps) {
    const classes = useStyles();
    const {onClose, open, segments} = props;

    const handleClose = () => {
        onClose("");
    };

    const handleListItemClick = (value: string) => {
        // onClose(value);
    };

    return (
        <Dialog onClose={handleClose}
                aria-labelledby="simple-dialog-title"
                disableEscapeKeyDown={false}
                open={open}>
            <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
            <List>
                {segments.map((segment, index) => (
                    <ListItem button key={index}>
                        <ListItemText primary={`${index + 1}: ${duration(segment)}`} secondary={segment.text}/>
                    </ListItem>
                ))}
                <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
                    <ListItemText primary="Add segment"/>
                </ListItem>
            </List>
        </Dialog>
    );
}

