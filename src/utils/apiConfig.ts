export const formatBytes = (bytes: string | number) => {
  const bytesInt = parseInt(
    typeof bytes === "string" ? bytes : bytes.toString()
  );
  if (bytesInt === 0) return "0B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytesInt) / Math.log(k));
  return (bytesInt / Math.pow(k, i)).toPrecision(3) + sizes[i];
};

export const formatTime = (milliseconds: number) => {
  if (milliseconds < 1000) return `${milliseconds}ms`;
  else if (milliseconds < 60 * 1000)
    return `${(milliseconds / 1000).toPrecision(3)}s`;
  else return `${(milliseconds / 60000).toPrecision(3)}min`;
};
