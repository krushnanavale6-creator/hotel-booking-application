
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="text-center">
                <div className="text-green-500 text-6xl mb-4">✓</div>

                <h1 className="text-3xl font-semibold mb-3">
                    Payment Successful
                </h1>

                <p className="text-gray-500 mb-6">
                    Your payment process has returned successfully.
                    Check your booking status before assuming payment is confirmed.
                </p>

                <Link
                    to="/Mybookings"
                    className="px-5 py-3 bg-blue-600 text-white rounded-md"
                >
                    View My Bookings
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
