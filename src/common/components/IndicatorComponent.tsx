import React, { useState, useEffect } from 'react'
import RotateRightIcon from '@mui/icons-material/RotateRight'

const IndicatorComponent: React.FC = () => {
  const [degree, setDegree] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setDegree(degree >= 360 ? 0 : degree + 1)
    }, 1000 / 360)
  }, [degree])

  return (
    <div className="indicator-area">
      <div className="indicator">
        <RotateRightIcon style={{ transform: `rotate(${degree}deg)` }} />
        Please wait...
      </div>
    </div>
  )
}

export default IndicatorComponent
