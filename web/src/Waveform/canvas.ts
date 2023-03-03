export function DrawWaveform(context: CanvasRenderingContext2D, samples: number[], waveformHeight: number, sampleWidth: number, fillStyle: string) {
  context.fillStyle = fillStyle
  if (samples.length === 0) {
    return
  }
  const maxDomain = samples.map(Math.abs).reduce((v, curr) => {
    return curr > v ? curr : v;
  })

  samples.forEach((s, i) => {
    const rectHeight = (s / maxDomain) * (waveformHeight)
    const y = (waveformHeight / 2) - (rectHeight / 2);
    context.fillRect(i * sampleWidth, y, 1, rectHeight)
  })
}

export function DrawWaveformUints(context: CanvasRenderingContext2D, samples: Uint16Array, waveformHeight: number, sampleWidth: number, fillStyle: string) {
  context.fillStyle = fillStyle
  if (samples.length === 0) {
    return
  }
  const maxDomain = samples.map(Math.abs).reduce((v, curr) => {
    return curr > v ? curr : v;
  })

  samples.forEach((s, i) => {
    const rectHeight = (s / maxDomain) * (waveformHeight)
    const y = (waveformHeight / 2) - (rectHeight / 2);
    context.fillRect(i * sampleWidth, y, 1, rectHeight)
  })
}

export function DrawBackground(context: CanvasRenderingContext2D, width: number, height: number, fillcolor: string) {
  context.fillStyle = fillcolor
  context.fillRect(0, 0, width, height)
}



