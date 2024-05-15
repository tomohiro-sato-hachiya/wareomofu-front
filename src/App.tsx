import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import Theses from './pages/theses/Theses'
import Thesis from './pages/theses/Thesis'
import CreateThesis from './pages/theses/CreateThesis'
import Themes from './pages/themes/Themes'
import Theme from './pages/themes/Theme'
import CreateTheme from './pages/themes/CreateTheme'
import HeaderPart from './common/components/HeaderPart'
import Profile from './pages/profile/Profile'
import Email from './pages/profile/Email'
import Password from './pages/profile/Password'
import User from './pages/users/User'
import Favorites from './pages/favorites/Favorites'
import FooterPart from './common/components/FooterPart'

const App: React.FC = () => {
  const { route } = useAuthenticator((context) => [context.route])
  const [isLogined, setIsLogined] = useState(false)
  const [currentUsername, setCurrentUsername] = useState('')

  useEffect(() => {
    setIsLogined(route === 'authenticated')
  }, [route])

  const getCurrentUsername = async () => {
    await Auth.currentAuthenticatedUser()
      .then((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        setCurrentUsername(user.username as string)
      })
      .catch((error) => {
        /**
         * このタイミングでは、単にユーザーがログインしていないだけの可能性もあるので、ダイアログでのメッセージ表示はせず、
         * コンソールへの出力のみを行う
         * */
        console.log(error)
        setCurrentUsername('')
      })
  }

  useEffect(() => {
    if (isLogined) {
      void getCurrentUsername()
    } else {
      setCurrentUsername('')
    }
  }, [isLogined])

  return (
    <>
      <HeaderPart />
      <div id="content" className="base-style">
        <Routes>
          <Route path="/" element={<Theses />} />
          <Route path="/theses/:id" element={<Thesis isLogined={isLogined} currentUsername={currentUsername} />} />
          <Route
            path="/thesis/create/:themeId"
            element={<CreateThesis isLogined={isLogined} currentUsername={currentUsername} />}
          />
          <Route path="/themes" element={<Themes />} />
          <Route path="/themes/:id" element={<Theme isLogined={isLogined} currentUsername={currentUsername} />} />
          <Route path="/theme/create" element={<CreateTheme isLogined={isLogined} />} />
          <Route path="/profile" element={<Profile isLogined={isLogined} />} />
          <Route path="/profile/email" element={<Email isLogined={isLogined} />} />
          <Route path="/profile/password" element={<Password isLogined={isLogined} />} />
          <Route path="/users/:username" element={<User isLogined={isLogined} currentUsername={currentUsername} />} />
          <Route path="/favorites" element={<Favorites isLogined={isLogined} currentUsername={currentUsername} />} />
        </Routes>
      </div>
      <FooterPart />
    </>
  )
}
export default App
