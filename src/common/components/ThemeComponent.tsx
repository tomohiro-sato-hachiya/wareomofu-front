import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ThemeSummary } from '../interface'
import { getDispDatetime, getPeriod } from '../util'
import { UserButtonComponent } from './ButtonComponents'

const ThemeComponent: React.FC<ThemeSummary> = (props) => {
  const { id, title, username, start_datetime, expire_datetime, theses, created_at } = props
  const [thesesCount, setThesesCount] = useState(0)
  useEffect(() => {
    let result = 0
    theses.map((thesis) => {
      result += thesis.is_suspended ? 0 : 1
      return true
    })
    setThesesCount(result)
  }, [theses])

  return (
    <div>
      <Link to={`/themes/${id}`}>
        <h4>{title}</h4>
      </Link>
      <UserButtonComponent username={username} />
      <br />
      受付期間:&nbsp;
      {
        getPeriod({
          title,
          start_datetime,
          expire_datetime,
        }).str
      }
      <br />
      投稿小論文数: {thesesCount}件
      <br />
      投稿日時: {getDispDatetime(created_at)}
    </div>
  )
}

export default ThemeComponent
