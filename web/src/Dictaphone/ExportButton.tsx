import {useBackendAPI} from "../App/useBackendAPI";
import {useInterval} from "../App/useInterval";
import React, {useCallback, useState} from "react";
import {Export} from "../api/types";
import {Button} from "@mui/material";

export function ExportButton({parentId}: { parentId: string }) {
  const api = useBackendAPI();
  const [watchingExport, setWatchingExport] = useState(false);
  const [exportProgress, setExportProgress] = useState<Export | null>(null);

  useInterval(() => {
    api.exports.GET(parentId)
      .then((r) => {
        setExportProgress(r.data);
        r.data.done && setWatchingExport(false)
      });
  }, watchingExport ? 200 : null);

  const startExport = useCallback(() => {
    return api.exports.POST(parentId).then(() => setWatchingExport(true));
  }, [api.exports, parentId]);

  return <Button onClick={startExport} disabled={watchingExport}>
    {watchingExport ? (exportProgress?.progress || "Starting export") : "Export"}
  </Button>;
}