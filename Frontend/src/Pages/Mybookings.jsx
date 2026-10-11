import React, { useEffect, useState } from 'react';
import Titile from '../Components/Titile';
import { assets } from '../assets/assets';
import { useUser } from '@clerk/react';



const Mybookings = () => {

    const { user } = useUser(); 

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingBookingId, setPayingBookingId] = useState(null);
    const [paymentError, setPaymentError] = useState("");
    useEffect(() => {

        const fetchBookings = async () => {


            const email = user?.primaryEmailAddress?.emailAddress;

            if (!email) {
                setLoading(false);
                return;
            }

            try {

                const response = await fetch(
                    `http://localhost:8080/api/bookings/user/${email}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }

                const data = await response.json();

                setBookings(data);

            } catch (error) {

                console.error('Error fetching bookings:', error);

            } finally {

                setLoading(false);

            }

        };

        fetchBookings();

    }, [user]);


    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p className='text-gray-500 text-lg'>
                    Loading bookings...
                </p>
            </div>
        );
    }

    
    
const handlePayment = async (bookingId) => {
  console.log("Paying booking ID:", bookingId);
  try {
    setPayingBookingId(bookingId);
    setPaymentError("");

    // Load Razorpay Checkout if it isn't already loaded.
    if (!window.Razorpay) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = resolve;
        script.onerror = () =>
          reject(new Error("Unable to load Razorpay Checkout"));
        document.body.appendChild(script);
      });
    }

    // Create the order on the backend.
    const response = await fetch(
      "http://localhost:8080/api/payments/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
        
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to create payment order");
    }

    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "QuickStay",
      description: `Hotel booking #${bookingId}`,
      order_id: data.orderId,

      handler: async function (paymentResponse) {
        try {
          setPaymentError("");

          // Verify payment with the backend.
          const verifyResponse = await fetch(
            "http://localhost:8080/api/payments/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                bookingId,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            }
          );

          const verifyData = await verifyResponse.json();

          if (!verifyResponse.ok) {
            throw new Error(
              verifyData.error || "Payment verification failed"
            );
          }

          // Reload bookings from the backend.
          const email = user?.primaryEmailAddress?.emailAddress;

          if (email) {
            const bookingsResponse = await fetch(
              `http://localhost:8080/api/bookings/user/${email}`
            );

            if (!bookingsResponse.ok) {
              throw new Error(
                "Payment verified, but bookings could not be refreshed"
              );
            }

            const updatedBookings = await bookingsResponse.json();
            setBookings(updatedBookings);
          }

          setPaymentError("");
        } catch (error) {
          console.error("Payment verification failed:", error);
          setPaymentError(
            error.message || "Payment verification failed"
          );
        } finally {
          setPayingBookingId(null);
        }
      },

      modal: {
        ondismiss: function () {
          setPayingBookingId(null);
        },
      },

      theme: {
        color: "#3B82F6",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.error("Razorpay payment failed:", response.error);
      setPaymentError(
        response.error?.description || "Payment failed. Please try again."
      );
      setPayingBookingId(null);
    });

    razorpay.open();
  } catch (error) {
    console.error("Payment initiation failed:", error);
    setPaymentError(
      error.message || "Payment could not be started. Please try again."
    );
    setPayingBookingId(null);
  }
};



    return (
      <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
        <Titile
          title="My Bookings"
          subTitle="Easily manage your past, current, and upcoming hotel reservations in one place."
          align="left"
        />

        {bookings.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-lg">You have no bookings yet.</p>
          </div>
        ) : (
          <div className="mt-10">
            {/* Table Header */}

            <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
              <div>Hotel</div>

              <div>Date & Timing</div>

              <div>Payment Status</div>
            </div>

            {/* Bookings */}

            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] gap-6 w-full border-b border-gray-300 py-6 first:border-t"
              >
                {/* Hotel Details */}

                <div className="flex flex-col md:flex-row">
                  <img
                    src={booking.room?.images?.[0] || assets.uploadArea}
                    alt="Hotel room"
                    className="w-full h-48 md:w-44 md:h-32 rounded shadow object-cover"
                  />

                  <div className="flex flex-col gap-1.5 max-md:mt-3 md:ml-4">
                    <p className="font-playfair text-2xl">
                      {booking.room?.hotel?.name || "Hotel"}

                      <span className="font-inter text-sm ml-1">
                        ({booking.room?.roomType || "Room"})
                      </span>
                    </p>

                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <img src={assets.locationIcon} alt="Location" />

                      <span>
                        {booking.room?.hotel?.address ||
                          "Address not available"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <img src={assets.guestsIcon} alt="Guests" />

                      <span>Guests: {booking.guests}</span>
                    </div>

                    <p className="text-base">Total: ${booking.totalPrice}</p>
                  </div>
                </div>

                {/* Date & Timing */}

                <div className="flex flex-row md:items-center gap-8 mt-3">
                  <div>
                    <p className="font-medium">Check-In:</p>

                    <p className="text-gray-500 text-sm">
                      {new Date(booking.checkInDate).toDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Check-Out:</p>

                    <p className="text-gray-500 text-sm">
                      {new Date(booking.checkOutDate).toDateString()}
                    </p>
                  </div>
                </div>

                {/* Payment Status */}

                {/* Payment Status */}

                <div className="flex flex-col items-start justify-center pt-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        booking.paymentStatus === "PAID" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>

                    <p className={`text-sm ${
                        booking.paymentStatus === "PAID" ? "text-green-500" : "text-red-500"
                      }`}>

                      {booking.paymentStatus === "PAID" ? "Paid" : "Unpaid"}
                    </p>
                  </div>

                  {/* pay-now-button */}

                    {booking.paymentStatus !== "PAID" && (
                        <button 
                        onClick={() => handlePayment(booking.id)}
                        disabled={payingBookingId === booking.id}
                         className="cursor-pointer mt-3 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:opacity-90">
                            {payingBookingId === booking.id ? "Opening Payment..." : "Pay Now"}
                        </button>
                    )}

                     {paymentError && (
                            <p className="mt-2 text-sm text-red-600">
                            {paymentError}
                            </p>
                        )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

};

export default Mybookings;