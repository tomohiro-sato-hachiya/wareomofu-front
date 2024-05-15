import React from 'react'

interface PROPS {
  label: string
}

const FirstPenguinComponent: React.FC<PROPS> = (props) => {
  const { label } = props
  return (
    <div className="center-area">
      <p>まだ{label}が投稿されていないようです。思い切って、ファーストペンギンになってみませんか?&#x1F427;</p>
    </div>
  )
}

export default FirstPenguinComponent
