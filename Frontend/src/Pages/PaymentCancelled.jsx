
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelled = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-3xl font-semibold mb-3">
                Payment Cancelled
            </h1>

            <p className="text-gray-500 mb-6">
                Your payment was not completed. You can try again from My Bookings.
            </p>

            <Link
                to="/Mybookings"
                className="px-5 py-3 bg-blue-600 text-white rounded-md"
            >
                Return to My Bookings
            </Link>
        </div>
    );
};

export default PaymentCancelled;
