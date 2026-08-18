import React, { useState } from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Footer from './Components/Footer';
import Allrooms from './Pages/Allrooms';
import Roomdetails from './Pages/Roomdetails';
import Mybookings from './Pages/Mybookings';
import HotelReg from './Components/HotelReg';
import Layout from './Pages/hotelOwner/Layout';
import Dashboard from './Pages/hotelOwner/Dashboard';
import AddRoom from './Pages/hotelOwner/AddRoom';
import ListRoom from './Pages/hotelOwner/ListRoom';
import EditRoom from './Pages/hotelOwner/EditRoom';


const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner");
  const [showHotelReg, setShowHotelReg] = useState(false);

  return (
    <div>
      {!isOwnerPath && <Navbar/> }
      
       {!isOwnerPath && (
        <button
          onClick={() => setShowHotelReg(true)}
          className='fixed bottom-5 right-5 z-50 bg-indigo-500 text-white px-5 py-3 rounded-lg cursor-pointer shadow-lg'
        >
          Register Your Hotel
        </button>
      )}

      {/* Show Hotel Registration Modal */}
      {showHotelReg && (
        <HotelReg setShowHotelReg={setShowHotelReg} />
      )}

      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/rooms' element={<Allrooms/>}/>

          
          <Route path='/rooms/:id' element={<Roomdetails/>}/>
          <Route path='/Mybookings' element={<Mybookings/>}/>
          <Route path='/owner' element={<Layout/>}>
              <Route index element={<Dashboard/>} />
              <Route path='add-room' element={<AddRoom/>} />
              <Route path='edit-room/:id' element={<EditRoom/>}/>
              <Route path='list-room' element={<ListRoom/>} />
          </Route>
          
        </Routes>
      </div>
      {!isOwnerPath && <Footer />}
    </div>
  )
}

export default App
