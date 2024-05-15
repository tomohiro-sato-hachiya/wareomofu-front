import React, { useState, useEffect, ChangeEvent } from 'react'
import { TextareaAutosize, RadioGroup, FormControl, FormControlLabel, Radio, FormLabel } from '@mui/material'
import axios from 'axios'
import { handleAxiosError } from '../util'
import Loading from './Loading'

interface PROPS {
  setReportReasonId: React.Dispatch<React.SetStateAction<number>>
  detail: string
  setDetail: React.Dispatch<React.SetStateAction<string>>
}

interface ReportReason {
  id: number
  reason: string
}

const ReportComponent: React.FC<PROPS> = (props) => {
  const { setReportReasonId, detail, setDetail } = props
  const [reportReasons, setReportReasons] = useState<[ReportReason] | null>(null)
  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL as string}/report/reasons`
    axios
      .get(url)
      .then((response) => {
        setReportReasons(response.data as [ReportReason])
      })
      .catch((error) => {
        handleAxiosError(error)
        setReportReasons(null)
      })
  }, [])

  const changeReportReasonId = (event: ChangeEvent<HTMLInputElement>) => {
    setReportReasonId(Number(event.target.value))
  }

  const changeDetail = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetail(event.target.value)
  }

  return (
    <>
      {reportReasons !== null && (
        <>
          <FormControl>
            <FormLabel id="report-radio-buttons-group-label">通報理由</FormLabel>
            <RadioGroup
              aria-labelledby="report-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={changeReportReasonId}
            >
              {reportReasons.map((reason) => (
                <FormControlLabel value={reason.id} control={<Radio />} label={reason.reason} />
              ))}
            </RadioGroup>
          </FormControl>
          <br />
          <TextareaAutosize value={detail} placeholder="詳細(任意)" onChange={changeDetail} className="text-area" />
        </>
      )}
      {reportReasons === null && <Loading />}
    </>
  )
}

export default ReportComponent
