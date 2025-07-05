import React from 'react'

const BlurCircle = ({ top = "auto", left = "auto", right = "auto", bottom = "auto",height="232px" , width="232px" }) => {
  return (
    <div className='absolute -z-50 h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl '
      style={{ top: top, left: left, right: right, bottom: bottom ,height:height,width:width}}>

    </div>
  )
}

export default BlurCircle