import React, { useState } from 'react'
import { CommentDetail } from '../../../../../common/interface'
import CommentReportComponent from './CommentReportComponent'
import { UserButtonComponent, ReportButtonComponent } from '../../../../../common/components/ButtonComponents'
import ReportDialogComponent from '../../../../../common/components/ReportDialogComponent'
import { getDispDatetime } from '../../../../../common/util'

interface PROPS extends CommentDetail {
  currentUsername: string
  isLogined: boolean
}

const CommentComponent: React.FC<PROPS> = (props) => {
  const { id, content, username, currentUsername, isLogined, created_at } = props
  const [isReporting, setIsReporting] = useState(false)

  const startReporting = () => {
    setIsReporting(true)
  }

  return (
    <p>
      <UserButtonComponent username={username} />
      {getDispDatetime(created_at)}
      <br />
      {isLogined && (
        <p>
          {!isReporting && username !== currentUsername && (
            <ReportButtonComponent func={startReporting} label="このコメントを通報する" />
          )}
          <ReportDialogComponent
            isReporting={isReporting}
            setIsReporting={setIsReporting}
            // eslint-disable-next-line react/no-children-prop
            children={<CommentReportComponent commentId={id} setIsReporting={setIsReporting} />}
            contentName="コメント"
          />
        </p>
      )}
      <span className="multi-line">{content}</span>
    </p>
  )
}

export default CommentComponent
