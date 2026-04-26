import React from 'react'

function roomPage() {
  return (
     <div className='flex-col  mx-9 my-9 border w-1/2 '>
    <div className='text-white text-2xl font-bold border flex items-center text-center'>
      PLAY WITH BOARD
    </div>
    <div className='flex justify-between  '>
       <div className='text-white border ml-8 text-2xl mt-4 h-80 rounded-md font-semibold'>
      CREATE ROOM
      <div className='mt-3 rounded-md mx-2 '>
        <input type='text' placeholder='Enter your Name'/>
      

      </div>
      <div className='mt-3 rounded-md mx-2'>
          <input type='text' placeholder='generate room code'/>
      </div>
      <div className="btn-group mx-3 my-3" role="group" aria-label="Basic outlined example">
  <button type="button" class="btn btn-outline-primary">generate</button>

  <button type="button" class="btn btn-outline-primary">copy</button>
</div>
    </div>
    <div className='text-white border mr-8 text-2xl mt-4 font-semibold'>
      JOIN ROOM
      <div className='mt-3 flex flex-col'>
        <input type='text'  className='rounded-md mx-2'/>
        
      </div>
      <button className='btn btn-outline-primary btn-sm mx-3 '>Join</button>
    </div>

    </div>
   
    
   </div>
  )
}

export default roomPage