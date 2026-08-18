import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Titile from '../../Components/Titile';
import { assets } from '../../assets/assets';
import { getRoomById, updateRoom } from '../../Services/Api';

const EditRoom = () => {

    const { id } = useParams();
    const navigate = useNavigate();

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
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Load existing room data on mount
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const room = await getRoomById(id);

                setRoomType(room.roomType || '');
                setPricePerNight(room.pricePerNight?.toString() || '');
                setHotelId(room.hotel?.id?.toString() || '');
                setExistingImages(room.images || []);

                const loadedAmenities = { ...amenities };
                (room.amenities || []).forEach((a) => {
                    if (loadedAmenities.hasOwnProperty(a)) {
                        loadedAmenities[a] = true;
                    }
                });
                setAmenities(loadedAmenities);

            } catch (err) {
                console.error('Failed to load room', err);
                alert('Could not load room details.');
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

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

        const newImageFiles = Object.values(images).filter((f) => f !== null);

        setSubmitting(true);

        try {
            await updateRoom(id, roomData, newImageFiles);
            alert('Room updated successfully.');
            navigate('/owner/list-room');
        } catch (error) {
            console.error('Error updating room', error);
            alert('Failed to update room.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p className='text-gray-500 mt-10'>Loading room details...</p>;
    }

  return (
    <form onSubmit={handleSubmit} className='pb-20'>
        <Titile align='left'
        font='outfit'
        title='Edit Room'
        subTitle='Update room details, pricing, and amenities. Upload new images only if you want to replace the current ones.'/>

        {/* Show existing images if no new ones are selected */}
        <p className='text-gray-800 mt-10'>Current Images</p>
        <div className='flex gap-4 my-2 flex-wrap'>
            {existingImages.length > 0 ? (
                existingImages.map((url, index) => (
                    <img key={index} src={url} alt="current room" className='max-h-24 rounded opacity-90'/>
                ))
            ) : (
                <p className='text-sm text-gray-500'>No images uploaded yet.</p>
            )}
        </div>

        <p className='text-gray-800 mt-6'>Upload New Images (optional — replaces all current images if used)</p>
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

        <br/>

        <button type='submit' disabled={submitting} className='bg-blue-600 text-white px-8 py-2 rounded mt-8 cursor-pointer disabled:opacity-50'>
            {submitting ? 'Updating...' : 'Update Room'}
        </button>

    </form>
  );
}

export default EditRoom;