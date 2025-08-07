import './index.css'
import { useState } from 'react'

// components
import Card from './components/card'
import Chart from './components/chart';
export default function App() {
  const [showchart, setshowchart] = useState<boolean>(false);

  return (
    <>
      {showchart && <Chart/>}
      <div className="min-h-screen w-screen flex justify-center items-center gap-4 flex-wrap p-10 ">
        <Card index={0} />
        <Card index={1} />
        <Card index={2} />
        <p onClick={() => { setshowchart(!showchart) }} className="fixed right-3 bottom-3 py-[0.7em] px-[1.4em] bg-blue-700 text-white rounded-[100px] cursor-pointer z-12 ">{!showchart ? 'View Bitcoin Chart' : 'View Coins Cards'}</p>
      </div>

    </>
  )
}


