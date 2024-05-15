import React, { useState } from 'react'
import axios from 'axios'
import { Auth } from 'aws-amplify'
import ReportComponent from '../../../../../common/components/ReportComponent'
import { ReportingComponentPropsBase, ReportBase } from '../../../../../common/interface'
import { confirmBeforeReport, handleAxiosError } from '../../../../../common/util'
import { ReportButtonComponent, CancelButtonComponent } from '../../../../../common/components/ButtonComponents'
import IndicatorComponent from '../../../../../common/components/IndicatorComponent'

interface PROPS extends ReportingComponentPropsBase {
  commentId: number
}

interface CommentReport extends ReportBase {
  comment_id: number
}

const CommentReportComponent: React.FC<PROPS> = (props) => {
  const { commentId, setIsReporting } = props
  const [reportReasonId, setReportReasonId] = useState(0)
  const [detail, setDetail] = useState('')
  const [indicatorFlag, setIndicatorFlag] = useState(false)

  const report = async () => {
    if (confirmBeforeReport()) {
      setIndicatorFlag(true)
    } else {
      return
    }
    const url = `${process.env.REACT_APP_API_URL as string}/report/comment`
    await Auth.currentAuthenticatedUser().then(async (user) => {
      const cognitoUser = await Auth.userSession(user)
      const accessToken = cognitoUser.getAccessToken().getJwtToken()
      const params: CommentReport = {
        access_token: accessToken,
        comment_id: commentId,
        report_reason_id: reportReasonId,
        detail,
      }
      axios
        .post(url, params)
        .then(() => {
          alert('通報が完了しました')
          setReportReasonId(0)
          setDetail('')
          setIsReporting(false)
        })
        .catch((error) => {
          handleAxiosError(error)
        })
        .finally(() => {
          setIndicatorFlag(false)
        })
    })
  }

  const cancel = () => {
    setIsReporting(false)
  }

  return (
    <>
      {indicatorFlag && <IndicatorComponent />}
      <ReportComponent setReportReasonId={setReportReasonId} detail={detail} setDetail={setDetail} />
      <br />
      <div className="right-area">
        <ReportButtonComponent func={report} />
        <CancelButtonComponent func={cancel} />
      </div>
    </>
  )
}

export default CommentReportComponent