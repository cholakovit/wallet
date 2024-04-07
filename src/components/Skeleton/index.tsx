import React from 'react'
import './index.css';

const Skeleton = ({ count = 1 }: { count: number }) => {
  return (
    <div className="skeleton-loader">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-name">Loading Data ...</div>
      ))}
  </div>
  )
}

export default Skeleton