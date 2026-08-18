import React, { useEffect, useState } from 'react';
import { roomsDummyData } from '../assets/assets';
import Hotelcard from './Hotelcard';
import Titile from './Titile';
import { useNavigate } from 'react-router-dom';

const FeaturedDestination = () => {

    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);

     useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/rooms');
                const data = await res.json();
                setRooms(data);
            } catch (err) {
                console.error('Failed to fetch rooms', err);
            }
        };
        fetchRooms();
    }, []);

  return (
    <div className='flex flex-col items-center px-6 lg:px-24 bg-slate-50 py-20'>
        <Titile title='Featured Destination' subTitle='Discover our handpicked selection of exceptional selection of exceptional properties around the world, offering unparelleled luxury and unforgettable experiences.'/>
      <div className='flex flex-wrap items-center justify-center gap-6 mt-20 '>
        {rooms.slice(0,4).map((room, index)=>(
            <Hotelcard key={room.id} room={room} index={index}/>
        ))}
      </div>

      <button onClick={()=>{navigate('/rooms'); window.scrollTo(0,0)}} className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>View All Destinations</button>
    </div>
  );
}

export default FeaturedDestination;
