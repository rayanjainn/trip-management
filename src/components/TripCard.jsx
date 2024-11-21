import React, { useState, useEffect } from "react";

const TripCard = ({
  destination,
  price,
  startDate,
  endDate,
  description,
  picture,
  onBookNow,
  isBooked,
}) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      <div className="relative h-48 w-full bg-gray-200">
        <img
          src={picture}
          alt={destination}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {destination}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            <p>From: {formatDate(startDate)}</p>
            <p>To: {formatDate(endDate)}</p>
          </div>
          <div className="text-2xl font-bold text-blue-600">${price}</div>
        </div>
        {isBooked ? (
          <p className="text-green-500 font-semibold text-center">
            Thank you for Booking!
          </p>
        ) : (
          <button
            onClick={onBookNow}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  );
};

export default TripCard;
