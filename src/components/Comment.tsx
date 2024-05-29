import React from 'react'

type commentProps = {
  id: number;
  name: string;
  body: string;
}


const Comment = ({ id, name, body }: commentProps) => {

  return (
    <div className='flex justify-start items-start gap-4'>
      <span className='flex items-center justify-center bg-cyan-500 text-white p-3 rounded-lg text-sm w-12 h-12'>{id.toString().slice(-3)}</span>
      <div>
        <h2 className='text-sm font-bold text-slate-700'>{name}</h2>
        <p className='text-slate-500 text-sm'>{body}</p>
      </div>
    </div>

  )
}

export default Comment