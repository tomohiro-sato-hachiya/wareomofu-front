import React, { useState } from 'react'
import { Button } from '@mui/material'
import axios from 'axios'
import { Auth } from 'aws-amplify'
import ReportComponent from '../../../common/components/ReportComponent'
import { ReportingComponentPropsBase, ReportBase } from '../../../common/interface'
import { confirmBeforeReport, handleAxiosError } from '../../../common/util'
import IndicatorComponent from '../../../common/components/IndicatorComponent'

interface PROPS extends ReportingComponentPropsBase {
  targetUsername: string
}

interface UserReport extends ReportBase {
  target_username: string
}

const UserReportComponent: React.FC<PROPS> = (props) => {
  const { targetUsername, setIsReporting } = props
  const [reportReasonId, setReportReasonId] = useState(0)
  const [detail, setDetail] = useState('')
  const [indicatorFlag, setIndicatorFlag] = useState(false)

  const report = async () => {
    if (confirmBeforeReport()) {
      setIndicatorFlag(true)
    } else {
      return
    }
    const url = `${process.env.REACT_APP_API_URL as string}/report/user`
    await Auth.currentAuthenticatedUser().then(async (user) => {
      const cognitoUser = await Auth.userSession(user)
      const accessToken = cognitoUser.getAccessToken().getJwtToken()
      const params: UserReport = {
        access_token: accessToken,
        target_username: targetUsername,
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
      <Button
        onClick={() => {
          void report()
        }}
      >
        通報
      </Button>
      <br />
      <Button onClick={cancel}>キャンセル</Button>
    </>
  )
}

export default UserReportComponent
