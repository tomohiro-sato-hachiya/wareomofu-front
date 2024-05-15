import React, { useState } from 'react'
import axios from 'axios'
import { Auth } from 'aws-amplify'
import ReportComponent from '../../../common/components/ReportComponent'
import { ReportingComponentPropsBase, ReportBase } from '../../../common/interface'
import { handleAxiosError, confirmBeforeReport } from '../../../common/util'
import { ReportButtonComponent, CancelButtonComponent } from '../../../common/components/ButtonComponents'
import IndicatorComponent from '../../../common/components/IndicatorComponent'

interface PROPS extends ReportingComponentPropsBase {
  themeId: number
}

interface ThemeReport extends ReportBase {
  theme_id: number
}

const ThemeReportComponent: React.FC<PROPS> = (props) => {
  const { themeId, setIsReporting } = props
  const [reportReasonId, setReportReasonId] = useState(0)
  const [detail, setDetail] = useState('')
  const [indicatorFlag, setIndicatorFlag] = useState(false)

  const cancel = () => {
    setIsReporting(false)
  }

  const report = async () => {
    if (confirmBeforeReport()) {
      setIndicatorFlag(true)
    } else {
      return
    }
    const url = `${process.env.REACT_APP_API_URL as string}/report/theme`
    await Auth.currentAuthenticatedUser().then(async (user) => {
      const cognitoUser = await Auth.userSession(user)
      const accessToken = cognitoUser.getAccessToken().getJwtToken()
      const params: ThemeReport = {
        access_token: accessToken,
        theme_id: themeId,
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

export default ThemeReportComponent
