import React, { useState } from "react";
import { X } from "react-feather";

const BookingModal = ({ trip, onClose, userData }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  const handlePay = async () => {
    const response = await fetch(
      "http://localhost:3000/api/book/" + userData[0].id + "/" + trip.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await response.json();
    if (responseData.message === "Booking successful") {
      setIsPaid(true);
    } else {
      console.log("Booking failed");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {trip.destination}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <img
            src={trip.picture}
            alt={trip.destination}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className="text-gray-600 mb-4">{trip.descp}</p>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-600">From: {trip.start_date}</p>
              <p className="text-gray-600">To: {trip.end_date}</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">${trip.price}</p>
          </div>
          {!isConfirmed ? (
            <button
              onClick={handleConfirm}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Confirm Booking
            </button>
          ) : !isPaid ? (
            <button
              onClick={handlePay}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
              Pay Now
            </button>
          ) : (
            <p className="text-green-500 font-semibold text-center">
              Booking Confirmed!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
