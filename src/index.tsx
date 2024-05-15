import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Amplify, I18n } from 'aws-amplify'
import { Authenticator, View, translations } from '@aws-amplify/ui-react'
import { AwsRum, AwsRumConfig } from 'aws-rum-web'
import reportWebVitals from './reportWebVitals'
import App from './App'
// eslint-disable-next-line import/extensions, import/no-unresolved
import '@aws-amplify/ui-react/styles.css'

import awsExports from './aws-exports'

try {
  const config: AwsRumConfig = {
    sessionSampleRate: 1,
    guestRoleArn: 'arn:aws:iam::485808461383:role/RUM-Monitor-ap-northeast-1-485808461383-1712519323761-Unauth',
    identityPoolId: 'ap-northeast-1:85e1c196-5b76-432d-8580-b4f373249381',
    endpoint: 'https://dataplane.rum.ap-northeast-1.amazonaws.com',
    telemetries: ['performance', 'errors', 'http'],
    allowCookies: false,
    enableXRay: false,
  }

  const APPLICATION_ID = 'd855e383-067a-4c49-89c1-3925aa56aa73'
  const APPLICATION_VERSION = '1.0.0'
  const APPLICATION_REGION = 'ap-northeast-1'

  const awsRum: AwsRum = new AwsRum(APPLICATION_ID, APPLICATION_VERSION, APPLICATION_REGION, config)
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}

Amplify.configure(awsExports)

I18n.putVocabularies(translations)
I18n.setLanguage('ja')

I18n.putVocabulariesForLanguage('ja', {
  Username: 'ユーザーネーム',
  'Create Account': 'ユーザー登録',
})

const container = document.getElementById('root')
if (container !== null) {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <Authenticator.Provider>
        <View>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </View>
      </Authenticator.Provider>
    </React.StrictMode>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals()
