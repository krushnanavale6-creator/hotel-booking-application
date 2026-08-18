import React, { useState, useEffect } from 'react';
import Titile from '../../Components/Titile';
import { assets } from '../../assets/assets';
import { useUser } from '@clerk/react';

const AddRoom = () => {

    const {user} = useUser();

    const [images, setImages] = useState({
        1: null,
        2: null,
        3: null,
        4: null,
    });

    const [roomType, setRoomType] = useState('');
    const [pricePerNight, setPricePerNight] = useState('');
    const [amenities, setAmenities] = useState({
        'Free Wifi' : false,
        'Free Breakfast': false,
        'Room Service': false,
        'Mountain View': false,
        'Pool Access': false,
    });

    const [hotelId, setHotelId] = useState('');

    // NEW: hotels list for the dropdown
    const [hotels, setHotels] = useState([]);

    // NEW: fetch hotels from backend on mount
    useEffect(() => {
        const fetchHotels = async () => {

            const email = user?.primaryEmailAddress?.emailAddress;
            if(!email) return;
            try {
                const res = await fetch(`http://localhost:8080/api/hotels/owner/${email}`);
                const data = await res.json();
                setHotels(data);
            } catch (err) {
                console.error('Failed to fetch hotels', err);
            }
        };
        fetchHotels();
    }, []);


      const handleAmenityChange = (amenity) => {
        setAmenities({
            ...amenities,
            [amenity]: !amenities[amenity]
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedAmenities = Object.keys(amenities)
        .filter((amenity) => amenities[amenity]);

    const roomData = {
        roomType: roomType,
        pricePerNight: Number(pricePerNight),
        available: true,
        amenities: selectedAmenities,
        hotel: {
            id: Number(hotelId)
        }
    };

    try {

        const formdata = new FormData();

        formdata.append(
            'room',
            new Blob([JSON.stringify(roomData)], {type: 'application/json'})
        );

        Object.values(images).forEach((file) => {
            if(file) {
                formdata.append('images', file);   // fixed: instance, not class
            }
        });

        const response = await fetch('http://localhost:8080/api/rooms/with-images', {   // fixed: correct endpoint
            method: 'POST',
            body: formdata   // fixed: instance, not class
        });

        if (response.ok) {
            alert("Room Added Successfully .");

            setRoomType('');
            setPricePerNight('');
            setHotelId('');

            setAmenities({
                'Free Wifi': false,
                'Free Breakfast': false,
                'Room Service': false,
                'Mountain View': false,
                'Pool Access': false,
            });

            setImages({
                1: null,
                2: null,
                3: null,
                4: null
            });

        }else{

            const errorText = await response.text();
            console.log(errorText);

            alert("failed to add room");

        }
    }catch (error) {

        console.error('Error', error);

        alert('Backend server is not running or connection failed');
    }
}

  return (
    <form onSubmit={handleSubmit} className='pb-20'>
        <Titile align='left' 
        font='outfit'
        title='Add Room' 
        subTitle='Fill in the details carefully and accurate room details, pricing, and amenities to enhance the user booking experience.'/>

        {/* upload are for images */}
        <p className='text-gray-800 mt-10'>Images</p>
        <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
            {Object.keys(images).map((key)=>(
                <label htmlFor={`roomImages${key}`} key={key}>
                    <img className='max-h-13 cursor-pointer opacity-80'
                     src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" />
                     <input type="file" accept='image/*' id={`roomImages${key}`} hidden
                     onChange={e=> setImages({...images, [key]: e.target.files[0]})}/>
                </label>
            ))}
        </div>

        <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
            <div className='flex-1 max-w-48'>
                <p className='text-gray-800 mt-4'>Room Type</p>
                <select value={roomType} 
                onChange={e=> setRoomType(e.target.value)} 
                    className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full' required>

                    <option value="">Select Room Type</option>
                    <option value="Single Bed">Single Bed</option>
                    <option value="Double Bed">Double Bed</option>
                    <option value="Luxury Room">Luxury Room</option>
                    <option value="Family Suite">Family Suite</option>

                </select>
            </div>

            <div>
                <p className='mt-4 text-gray-800'>
                    Price <span className='text-xs'>/night</span>
                </p>
                <input type="number" placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24 '
                value={pricePerNight} onChange={e=> setPricePerNight(e.target.value)} required/>
            </div>

        </div>

        <p className='text-gray-800 mt-4'>Amenities</p>
        <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
            {Object.keys(amenities).map((amenity, index)=>(
                <div key={index}>
                    <input type="checkbox" id={`amenities${index+1}`} checked={amenities[amenity]}
                     onChange={()=>handleAmenityChange(amenity)}/>
                     <label htmlFor={`amenities${index+1}`}>  {amenity}</label>
                </div>
            ))}
        </div>

        {/* Hotel dropdown (replaces free-text Hotel Id) */}

        <p className='text-gray-800 mt-4'>
            Hotel
        </p>
        {hotels.length === 0 ? (
            <p className='text-sm text-gray-500 mt-1'>
             You haven't registered a hotel yet. Register one first to add rooms.
            </p>
            ) : (
            <select
                value={hotelId}
                onChange={(e) => setHotelId(e.target.value)}
                 className='border border-gray-300 mt-1 rounded p-2 max-w-60'
                required>
                    <option value="">Select Hotel</option>
                        {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                        </option>
                ))}
            </select>
        )}


        <br />
        

        <button type='submit' className='bg-blue-600 text-white px-8 py-2 rounded mt-8 cursor-pointer'>
            Add Room
        </button>

    </form>
  );
}

export default AddRoom;