import React, { useEffect, useState } from 'react';
import { getRoomsByOwner, updateRoomAvailability } from '../../Services/Api';
import Titile from '../../Components/Titile';
import { useUser } from '@clerk/react';
import { useNavigate } from 'react-router-dom';

const ListRoom = () => {

    const { user } = useUser();

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchRooms = async () => {
            const email = user?.primaryEmailAddress?.emailAddress;
            if (!email) {
                setLoading(false);
                return;
            }

            try{
                const data = await getRoomsByOwner(email);
                setRooms(data);
            }catch(error) {
                console.error("Error fetching rooms:", error);
            }finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [user]);

    const handleToggleAvailability = async (roomId, currentValue) => {
        // Optimistically update the UI first
        setRooms(prevRooms =>
            prevRooms.map(room =>
                room.id === roomId ? { ...room, available: !currentValue } : room
            )
        );

        try {
            await updateRoomAvailability(roomId, !currentValue);
        } catch (error) {
            console.error("Failed to update availability:", error);
            // Roll back on failure
            setRooms(prevRooms =>
                prevRooms.map(room =>
                    room.id === roomId ? { ...room, available: currentValue } : room
                )
            );
            alert("Failed to update availability. Please try again.");
        }
    };

    if(loading){
        return <p>Loading rooms...</p>
    }

  return (
    <div>
      <Titile align='left' 
      font='outfit'
       title='Room Listings' 
       subTitle='View, edit, or manage all listed rooms. keep the information up to date to provide best experience for users.'
    />
      <p className='text-gray-500 mt-8'>All Rooms</p>

      {rooms.length === 0 ? (
        <p className='text-gray-500 mt-4'>You haven't added any rooms yet.</p>
      ) : (
      <div className='w-full max-w-3xl text-left border border-gray-300
       rounded-lg max-h-80 overflow-y-scroll mt-3'>

            <table className='w-full'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
                        <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
                        <th className='py-3 px-4 text-gray-800 font-medium '>Price / night</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-center'>Action</th>
                    </tr>
                </thead>
                <tbody className='text-sm'>
                    {
                        rooms.map((item)=>(
                            <tr key={item.id}>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.roomType}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                    {item.amenities.join(', ')}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.pricePerNight}
                                </td>
                                <td className='py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center'>
                                    <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                                        <input
                                            type="checkbox"
                                            className='sr-only peer'
                                            checked={item.available}
                                            onChange={() => handleToggleAvailability(item.id, item.available)}
                                        />
                                        <div className='w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors 
                                        duration-200'>

                                        </div>
                                        <span className='dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform
                                        duration-200 ease-in-out peer-checked:translate-x-5'>

                                        </span>
                                    </label>
                                </td>
                                <td className='py-3 px-4 border-t border-gray-300 text-center'>
                                    <button className='bg-blue-600 hover:underline text-sm cursor-pointer text-white px-3 py-1 rounded'
                                    onClick={() => navigate(`/owner/edit-room/${item.id}`)}>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

      </div>
      )}
    </div>
  );
}

export default ListRoom;