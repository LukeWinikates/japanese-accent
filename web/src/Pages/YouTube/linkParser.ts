const longFormMatcher = /\?v=([a-zA-Z0-9]{11})/;
const shortFormMatcher = /https:\/\/youtu.be\/([a-zA-Z0-9]{11})/;

export function idFrom(videoUserInput: string) {
  if (videoUserInput.length === 11 && videoUserInput.match(/^[a-zA-Z0-9]{11}$/)) {
    return videoUserInput;
  }

  let matches = videoUserInput.match(shortFormMatcher);
  if (matches) {
    return matches[1];
  }

  matches = videoUserInput.match(longFormMatcher);
  if (matches) {
    return matches[1];
  }

  return null;
}