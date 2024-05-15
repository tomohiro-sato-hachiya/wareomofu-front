import React from 'react'
import { Link } from 'react-router-dom'

const FooterPart: React.FC = () => (
  <footer className="center-area">
    <Link to="/">
      <img src="/logo.png" alt="我思フ - 小論文投稿プラットフォーム" />
    </Link>
    <br />
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${process.env.REACT_APP_PUBLIC_FILES_URL as string}/documents/terms_and_conditions.pdf`}
    >
      利用規約
    </a>
    <br />
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${process.env.REACT_APP_PUBLIC_FILES_URL as string}/documents/privacy_policy.pdf`}
    >
      プライバシーポリシー
    </a>
    <br />
    <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_MANUAL_URL as string}`}>
      ご利用マニュアル
    </a>
    <br />
    お問合せ先:&nbsp;
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`mailto:${process.env.REACT_APP_SUPPORT_EMAIL_ADDRESS as string}`}
    >
      {process.env.REACT_APP_SUPPORT_EMAIL_ADDRESS as string}
    </a>
    <br />
    &copy;{new Date().getFullYear()} 好日ウェブテクノロジー All rights reserved.
  </footer>
)

export default FooterPart
