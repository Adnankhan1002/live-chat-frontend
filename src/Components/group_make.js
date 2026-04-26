import React from 'react'

function group_make() {
  return (
    <div className="flex items-center justify-center h-screen w-4/5">
    <div className=" h-85 w-5/6 flex justify-center object-cover ">
    <div
className="relative z-10 flex w-5/6 cursor-pointer items-center overflow-hidden rounded-xl border border-slate-800 p-[1.5px]"
>
<div
className="animate-rotate absolute inset-0 h-full w-full rounded-full bg-[conic-gradient(#0ea5e9_20deg,transparent_120deg)]"
></div>
<div className="relative z-20 flex w-full rounded-[0.60rem] bg-slate-900 p-2">
<input
type="text"
className="mr-2 inline-block h-full flex-1 rounded-lg bg-transparent px-2 py-3 placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
placeholder="Enter Your Group Name"
/>

<span
className=" block rounded-lg border border-slate-800 bg-slate-900 px-8 py-3 text-center text-sm text-white shadow-2xl transition duration-200 hover:bg-slate-800"
>
CREATE
</span>
</div>
</div>

    </div>

</div>

  )
}

export default group_make