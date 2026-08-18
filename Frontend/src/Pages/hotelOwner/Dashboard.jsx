import React, { useEffect, useState } from 'react';
import Titile from '../../Components/Titile';
import { assets } from '../../assets/assets';
import { getBookingsByOwner } from '../../Services/Api';
import { useUser } from '@clerk/react';

const Dashboard = () => {

    const { user } = useUser();

    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        bookings: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchBookings = async () => {
            const email = user?.primaryEmailAddress?.emailAddress;
            if (!email) {
                setLoading(false);
                return;
            }

            try {
                const bookings = await getBookingsByOwner(email);

                const totalRevenue = bookings.reduce(
                    (sum, booking) => sum + (booking.totalPrice || 0), 0
                );

                setDashboardData({
                    totalBookings: bookings.length,
                    totalRevenue: totalRevenue,
                    bookings: bookings
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();

    }, [user]);

    if (loading) {
        return <p className='text-gray-500 mt-10'>Loading dashboard...</p>
    }

  return (
    <div>
      <Titile align='left' font='outfit' title='Dashboard' subTitle='Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated
       with real-tine insights to ensure smooth operations.' />

        <div className='flex gap-4 my-8'>
            {/* Total bookings */}
            <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10'/>
                <div className='flex flex-col sm:ml-4 font-medium'>
                    <p className='text-blue-500 text-lg'>Total Bookings</p>
                    <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
                </div>
            </div>

            {/* Total revenue */}

            <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10'/>
                <div className='flex flex-col sm:ml-4 font-medium'>
                    <p className='text-blue-500 text-lg'>Total Revenue</p>
                    <p className='text-neutral-400 text-base'>$ {dashboardData.totalRevenue}</p>
                </div>
            </div>
        </div>

        {/* Recent Bookings */}
            <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>

            {dashboardData.bookings.length === 0 ? (
                <p className='text-gray-500'>No bookings yet for your hotels.</p>
            ) : (
            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Room Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Status</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {dashboardData.bookings.map((item)=>(
                            <tr key={item.id}>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.guestName}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                    {item.room?.roomType}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                    ${item.totalPrice}
                                </td>
                                <td className='py-3 px-4 border-t border-gray-300 flex'>
                                    <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.status === 'CONFIRMED' ? 'bg-green-200 text-green-600' : item.status === 'CANCELLED' ? 'bg-red-200 text-red-600' : 'bg-amber-200 text-yellow-600'}`}>
                                        {item.status || 'PENDING'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}

    </div>
  );
}

export default Dashboard;