import React from 'react'
import { Dialog, DialogTitle } from '@mui/material'
import { ReportingComponentPropsBase } from '../interface'

interface PROPS extends ReportingComponentPropsBase {
  isReporting: boolean
  children: JSX.Element
  contentName: string
}

const ReportDialogComponent: React.FC<PROPS> = (props) => {
  const { setIsReporting, isReporting, children, contentName } = props

  const cancel = () => {
    setIsReporting(false)
  }

  return (
    <Dialog open={isReporting} onClose={cancel}>
      <div className="report-area">
        <DialogTitle>悪質{contentName}の通報</DialogTitle>
        {children}
      </div>
    </Dialog>
  )
}

export default ReportDialogComponent
