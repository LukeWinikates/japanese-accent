import React from 'react';

interface Props {
  onChooseItem: (s: string) => void
  options: string[]
}

export function TextOptionChooser({options}: Props) {
  return (<ul>
    {
      options.map((o, i) => {
        return <li key={i}>
          {o}
        </li>
      })
    }
  </ul>);
}