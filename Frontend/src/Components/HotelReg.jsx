import React, { useState } from 'react';
import { assets, cities } from '../assets/assets';
import { useUser } from '@clerk/react';

const HotelReg = ({setShowHotelReg}) => {

    const { user } = useUser();

    const [hotelData, setHotelData] = useState({
        name: '',
        contact: '',
        address: '',
        city: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setHotelData({
            ...hotelData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('Please log in before registering a hotel.');
            return;
        }

        setLoading(true);

        try{
            const response = await fetch('http://localhost:8080/api/hotels',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        ...hotelData,
                        ownerEmail: user.primaryEmailAddress?.emailAddress
                    })
                }
            );

            if (response.ok) {
                const savedHotel = await response.json();
                console.log("Hotel saved : ", savedHotel);
                alert("Hotel registered successfully!");

                //clear form
                setHotelData({
                    name: '',
                    contact: '',
                    address: '',
                    city: ''
                });

                //close registration popup
                setShowHotelReg(false);

            }
            else {
                const errorData = await response.text();
                console.error(errorData);
                alert("Failed to register hotel");
            }
        }
        catch(error) {

            console.error("Error: ", error);

            alert(
                'Could not connect to backend. Make sure Spring Boot is Running.'
            )
        }
        finally {
            setLoading(false);
        }
    }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70'>
      <form onSubmit={handleSubmit}
       className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'>
        <img onClick={() => setShowHotelReg(false)} src={assets.regImage} alt="reg-image" className='w-1/2 rounded-xl hidden md:block'/>

        <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
            <img onClick={() => setShowHotelReg(false)} src={assets.closeIcon} alt="close-icon" className='absolute top-4 right-4 h-4 w-4 cursor-pointer' />
            <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>

            {/* Hotel name */}
            <div className='w-full mt-4'>
                <label htmlFor="name" className='font-medium text-gray-500'>
                    Hotel Name
                </label>
                <input value={hotelData.name} onChange={handleChange}
                 id='name' type="text" placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required/>
            </div>
            {/* phone number */}
            <div className='w-full mt-4'>
                <label htmlFor="contact" className='font-medium text-gray-500'>
                    Phone
                </label>
                <input value={hotelData.contact} onChange={handleChange} id='contact' type="text" placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required/>
            </div>

            {/* Address */}
            <div className='w-full mt-4'>
                <label htmlFor="address" className='font-medium text-gray-500'>
                    Address
                </label>
                <input value={hotelData.address} onChange={handleChange}
                  id='address' type="text" placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required/>
            </div>

            {/* Select city dropdown */}
            <div className='w-full mt-4 max-w-60 mr-auto'>
                <label htmlFor="city" className='font-medium text-gray-500'>
                    City
                </label>
                <select value={hotelData.city} onChange={handleChange} id="city" className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required>
                    <option value="">select City</option>
                    {cities.map((city)=>(
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>
            <button type='submit' disabled={loading} className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6'>
                 {loading ? 'Registering...' : 'Register'}
            </button>
        </div>
      </form>
    </div>
  );
}

export default HotelReg;