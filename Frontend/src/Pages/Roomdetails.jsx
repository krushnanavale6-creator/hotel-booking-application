import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets';
import StarRating from '../Components/StarRating';
import { useClerk, useUser } from '@clerk/react';
import { checkRoomAvailabity } from '../Services/Api';


const Roomdetails = () => {

    const { id } = useParams()
    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)

    const { user } = useUser();
    const { openSignIn } = useClerk();

    // Booking form state
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState('');
    const [isBooking, setIsBooking] = useState(false);


    //availabilty check state
    const [isChecking, setIsChecking] = useState(false);
    const [availabilityResult, setAvailabilityResult] = useState(null);


    useEffect(() => {
        const fetchRoom = async () => {
            try{
                const res = await fetch(`http://localhost:8080/api/rooms/${id}`);
                if(!res.ok) {
                    console.error("Room Not Found");
                    alert("room not found");
                    return;
                }
                const data = await res.json();
                setRoom(data);
                setMainImage(data.images?.[0] || assets.uploadArea);
            }catch (err) {
                console.error("Failed to fetch room", err)
            }
        };
        fetchRoom();
    }, [id])


    // Calculate nights and total price
    const calculateNights = () => {
        if (!checkInDate || !checkOutDate) return 0;
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const diffTime = end - start;
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 0;
    };

    const nights = calculateNights();
    const totalPrice = nights * (room?.pricePerNight || 0);

    //reset availability result whenever dates change
    useEffect (() => {
        setAvailabilityResult(null);
    }, [checkInDate, checkOutDate])

    const handleAvailability = async (e) => {
        e.preventDefault();

        if (nights <= 0) {
            alert("Please select a valid check-In and check-Out date.")
            return;
        }

        setIsChecking(true);
        setAvailabilityResult(null);

        try{
            const result = await checkRoomAvailabity(room.id, checkInDate, checkOutDate);
            setAvailabilityResult(result.available);

        } catch(error) {
            console.error("Error checking availability", error);
            alert("Could not check availability. Please try again.");
        } finally {
            setIsChecking(false);
        }
    }


    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        // Must be logged in to book
        if (!user) {
            openSignIn();
            return;
        }

        if (nights <= 0) {
            alert('Check-out date must be after check-in date.');
            return;
        }

        setIsBooking(true);

        const bookingData = {
            room: { id: room.id },
            guestName: user.fullName || user.username || 'Guest',
            guestEmail: user.primaryEmailAddress?.emailAddress || '',
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            guests: Number(guests),
            totalPrice: totalPrice
        };

        try {
            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            if (response.ok) {
                alert('Booking confirmed! Check "My Bookings" for details.');
                setCheckInDate('');
                setCheckOutDate('');
                setGuests('');
            } else {
                alert('Failed to create booking. Please try again.');
            }
        } catch (error) {
            console.error('Error', error);
            alert('Backend server is not running or connection failed.');
        } finally {
            setIsBooking(false);
        }
    };


  return room && (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
            <h1 className='text-3xl md:text-4xl font-playfair'>
                {room.hotel?.name} <span className='font-inter text-sm'>({room.roomType})</span>
            </h1>
            <p>20% OFF</p>
        </div>

        <div className='flex items-center gap-1 mt-2'>
            <StarRating/>
            <p className='ml-2'>200+ reviews</p>
        </div>

        <div className='flex items-center gap-1 text-gray-500 mt-2'>
            <img src={assets.locationIcon} alt="locationicon" />
            <span>{room.hotel?.address}</span>
        </div>
        <div className='flex flex-col lg:flex-row mt-6 gap-6'>
            <div className='lg:w-1/2 w-full'>
                <img src={mainImage || assets.uploadArea} alt="roomimage" className='w-full rounded-xl shadow-lg object-cover'/>
            </div>
            <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                {room.images?.length > 1 && room.images.map((image, index)=>(
                    <img key={index} src={image} alt="room image"  onClick={() => setMainImage(image)}
                    className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image && 'outline-3 outline-orange-500'}`}/>
                ))}
            </div>
        </div>

        <div className='flex flex-col md:flex-row md:justify-between mt-10'>
            <div className='flex flex-col'>
                <h1 className='text-3xl md:text-4xl font-playfair'>Experience luxury like never before!!</h1>
                <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                    {room.amenities?.map((item, index)=>(
                        <div key={index} className='flex items-center gap-2 px-3py-2 rounded-lg bg-gray-100'>
                            <img src={facilityIcons[item]} alt={item} className='w-5 h-5'/>
                            <p className='text-xs'>{item}</p>
                        </div>
                    ))}

                </div>
            </div>
            <p className='text-2xl font-medium'>${room.pricePerNight}/night</p>
        </div>

        {/* check in check-out form */}

        <form onSubmit={handleAvailability} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
                    <div className='flex flex-col'>
                        <label htmlFor="CheckInDate" className='font-medium'>Check-In</label>
                        <input type="date" id='CheckInDate' placeholder='Check-In'
                        value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
                    </div>

                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                    <div className='flex flex-col'>
                        <label htmlFor="CheckOutDate" className='font-medium'>Check-Out</label>
                        <input type="date" id='CheckOutDate' placeholder='Check-Out'
                        value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)}
                        min={checkInDate || new Date().toISOString().split('T')[0]}
                        className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
                    </div>

                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    
                    <div className='flex flex-col'>
                        <label htmlFor="guests" className='font-medium'>Guests</label>
                        <input type="number" id='guests' placeholder='0' min="1"
                        value={guests} onChange={(e) => setGuests(e.target.value)}
                        className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
                    </div>

                    {nights > 0 && (
                        <div className='flex flex-col text-gray-700'>
                            <p className='font-medium'>{nights} night{nights > 1 ? 's' : ''}</p>
                            <p className='text-sm'>Total: ${totalPrice}</p>
                        </div>
                    )}

                </div>

                <button type="submit" disabled={isBooking} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 sm:px-8 md:px-10 py-3 md:py-4 text-base sm:text-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 w-full md:w-auto disabled:opacity-50">
                    {isBooking ? 'Booking...' : 'Check Availabilty'}
                </button>
                
        </form>

        {/* New : Availability result + Book Now */}

        {availabilityResult !== null && (
            <div className='max-w-6xl mx-auto mt-4 px-6'>
                {availabilityResult ? (
                    <div className='flex flex-col md:flex-row items-start md:items-center justify-between bg-green-50 border border-green-300 rounded-xl p-4'>
                        <p className='text-green-700 font-medium'>
                             ✓ This room is available for your selected dates.
                        </p>
                        <button onClick={handleBookingSubmit} 
                                disabled={isBooking}
                                className='mt-3 md:mt-0 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-8 py-3 cursor-pointer transition-all disabled:opacity-50'>
                                    {isBooking ? 'Booking...' : "Book Now"}
                            
                        </button>

                    </div>
                ) : (
                    <div className='bg-red-50 border border-red-300 rounded-xl p-4'>
                        <p className='text-red-700 font-medium'>
                            This room is not available for the selected dates. Please try different dates.
                        </p>
                    </div>
                )}
            </div>
        )}

        {/* Common Specification */}
        <div className='mt-25 space-y-4'>
            {roomCommonData.map((spec, index)=>(
                <div key={index} className='flex items-start gap-2'>
                    <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5'/>
                    <div>
                        <p className='text-base'>{spec.title}</p>
                        <p className='text-gray-500'> {spec.description}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Hosted by */}
       <div className='flex flex-col items-start gap-4'>
            <div className='flex gap-4'>
                <img src={assets.userIcon || assets.uploadArea} alt="Host" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
                <div>
                    <p className='text-lg md:text-xl'>Hosted by {room.hotel?.name}</p>
                    <div className='flex items-center mt-1'>
                        <StarRating/>
                        <p className='ml-2'>200+ reviews</p>
                    </div>
                </div>
            </div>
       </div>

    </div>
  );
}

export default Roomdetails;