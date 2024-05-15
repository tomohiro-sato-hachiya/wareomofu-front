import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import CreateIcon from '@mui/icons-material/Create'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import ReportIcon from '@mui/icons-material/Report'
import CancelIcon from '@mui/icons-material/Cancel'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { getDisplayUsername } from '../util'

interface PROPS {
  func: () => void | Promise<void>
}

interface BaseProps extends PROPS {
  label: string
  icon: JSX.Element
  // eslint-disable-next-line react/require-default-props
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
}

interface GoToProps {
  to: string
  label: string
}

interface GoToPropsBase {
  to: string
  label: string
  icon: JSX.Element
  color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
}

interface UserProps {
  username: string | null
}

interface ReportProps extends PROPS {
  // eslint-disable-next-line react/require-default-props
  label?: string
}

const fontSizeBase = 'medium'
const variant = 'contained'
const createIcon = <CreateIcon fontSize={fontSizeBase} />

export const ButtonComponentBase: React.FC<BaseProps> = (props) => {
  const { func, label, icon, color } = props
  return (
    <Button
      variant={variant}
      onClick={() => {
        void func()
      }}
      color={color || 'primary'}
    >
      {icon}
      {label}
    </Button>
  )
}

export const SearchButtonComponent: React.FC<PROPS> = (props) => {
  const { func } = props
  return <ButtonComponentBase func={func} label="検索" icon={<SearchIcon fontSize={fontSizeBase} />} />
}

export const SubmitButtonComponent: React.FC<PROPS> = (props) => {
  const { func } = props
  return <ButtonComponentBase func={func} label="投稿" icon={createIcon} />
}

const GoToButtonComponentBase: React.FC<GoToPropsBase> = (props) => {
  const { to, label, icon, color } = props
  return (
    <div className="link-button-area">
      <Link to={to}>
        <Button variant={variant} color={color}>
          {icon}
          {label}
        </Button>
      </Link>
    </div>
  )
}

export const GoBackButtonComponent: React.FC<GoToProps> = (props) => {
  const { to, label } = props
  return (
    <GoToButtonComponentBase
      to={to}
      label={label}
      icon={<KeyboardReturnIcon fontSize={fontSizeBase} />}
      color="secondary"
    />
  )
}

export const GoToSubmitButtonComponent: React.FC<GoToProps> = (props) => {
  const { to, label } = props
  return <GoToButtonComponentBase to={to} label={label} icon={createIcon} color="primary" />
}

export const UserButtonComponent: React.FC<UserProps> = (props) => {
  const { username } = props
  const size = 'small'
  return (
    <div className="link-button-area">
      <Link to={username ? `/users/${encodeURIComponent(username)}` : ''}>
        <Button variant={variant} size={size}>
          <AccountCircleIcon fontSize={size} />
          {getDisplayUsername(username)}
        </Button>
      </Link>
    </div>
  )
}

export const ReportButtonComponent: React.FC<ReportProps> = (props) => {
  const { func, label } = props
  return (
    <ButtonComponentBase
      func={func}
      label={label || '通報'}
      icon={<ReportIcon fontSize={fontSizeBase} />}
      color="error"
    />
  )
}

export const CancelButtonComponent: React.FC<PROPS> = (props) => {
  const { func } = props
  return (
    <ButtonComponentBase func={func} label="キャンセル" icon={<CancelIcon fontSize={fontSizeBase} />} color="info" />
  )
}
