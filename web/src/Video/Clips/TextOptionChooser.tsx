import React from 'react';

interface Props {
  onChooseItem: (s: string) => void
  options: string[]
}

export function TextOptionChooser({options}: Props) {
  return (<ul>
    {
      options.map((o) => {
        return <li key={o}>
          {o}
        </li>
      })
    }
  </ul>);
}