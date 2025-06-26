import React from "react"

const Back = ({ name, title }) => {
  return (
    <>
      <div className='back'>
        <div className='container'>
          <span>{name}</span>
          <h1>{title}</h1>
        </div>
      </div>
    </>
  )
}

export default Back