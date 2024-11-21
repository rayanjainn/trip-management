import React, { useCallback, useEffect, useState } from "react";
import TripCard from "./TripCard";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Calendar,
  DollarSign,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
} from "react-feather";
import { useNavigate } from "react-router-dom";
import BookingModal from "./BookingModal";

const Calender = ({ onChange, selectedRange, onClear }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(
    selectedRange?.start || null
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    selectedRange?.end || null
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handleDateClick = useCallback(
    (day) => {
      const clickedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        setSelectedStartDate(clickedDate);
        setSelectedEndDate(null);
        onChange({ start: clickedDate, end: null });
      } else {
        if (clickedDate > selectedStartDate) {
          setSelectedEndDate(clickedDate);
          onChange({ start: selectedStartDate, end: clickedDate });
        } else {
          setSelectedEndDate(selectedStartDate);
          setSelectedStartDate(clickedDate);
          onChange({ start: clickedDate, end: selectedStartDate });
        }
      }
    },
    [currentDate, selectedStartDate, selectedEndDate, onChange]
  );

  const handleClear = useCallback(() => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onClear();
  }, [onClear]);

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const isDateInRange = useCallback(
    (day) => {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      return (
        (selectedStartDate && date.getTime() === selectedStartDate.getTime()) ||
        (selectedEndDate && date.getTime() === selectedEndDate.getTime()) ||
        (selectedStartDate &&
          selectedEndDate &&
          date > selectedStartDate &&
          date < selectedEndDate)
      );
    },
    [currentDate, selectedStartDate, selectedEndDate]
  );

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          type="button"
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="font-semibold">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          type="button"
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-gray-500 text-sm font-medium">
            {day}
          </div>
        ))}
        {[...Array(firstDayOfMonth).keys()].map((i) => (
          <div key={`empty-${i}`} />
        ))}
        {[...Array(daysInMonth).keys()].map((i) => {
          const day = i + 1;
          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDateClick(day)}
              className={`p-2 rounded-full hover:bg-blue-100 ${
                isDateInRange(day)
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : ""
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {(selectedStartDate || selectedEndDate) && (
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {selectedStartDate && selectedStartDate.toLocaleDateString()}
            {selectedEndDate && ` - ${selectedEndDate.toLocaleDateString()}`}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-red-500 hover:text-red-700 flex items-center"
          >
            <X size={16} className="mr-1" /> Clear
          </button>
        </div>
      )}
    </div>
  );
};

const Home = ({ isLoggedIn, setIsLoggedIn, userData }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signin");
    }
  }, [isLoggedIn]);

  const [tripData, setTripData] = useState([{}]);
  const [destinationData, setDestinationData] = useState([]);
  const getTrips = async () => {
    try {
      const url =
        activeTab === "all"
          ? "http://localhost:3000/api/trips"
          : "http://localhost:3000/api/trips/" + userData[0].id;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch trips");
      }
      const responseData = await response.json();
      setTripData(responseData.trips);
      setDestinationData(
        ...[responseData.trips.map((trips) => trips.destination)]
      );
    } catch (error) {
      console.log("Error fetching trips: " + error);
    }
  };

  useEffect(() => {
    getTrips();
  }, [activeTab]);

  const filteredTrips = tripData.filter((trip) => {
    const matchesSearch =
      trip.destination && typeof trip.destination === "string"
        ? trip.destination
            .toLowerCase()
            .includes((searchTerm || "").toLowerCase())
        : true;
    const matchesPrice =
      trip.price >= priceRange[0] && trip.price <= priceRange[1];
    const matchesDate =
      (!dateRange.start || new Date(trip.startDate) >= dateRange.start) &&
      (!dateRange.end || new Date(trip.endDate) <= dateRange.end);
    const matchesDestination =
      selectedDestinations.length === 0 ||
      (trip.destination &&
        selectedDestinations.some((dest) => trip.destination.includes(dest)));
    return matchesSearch && matchesPrice && matchesDate && matchesDestination;
  });

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const clearDateFilter = () => {
    setDateRange({ start: null, end: null });
  };

  const handleBookNow = (trip) => {
    setSelectedTrip(trip);
    setIsBookingModalOpen(!isBookingModalOpen);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(!isBookingModalOpen);
    setSelectedTrip(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Discover Your Dream Destination
          </h1>
          <p className="text-xl mb-8">
            Embark on unforgettable journeys, create lasting memories
          </p>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for your next adventure..."
              className="w-full px-4 py-3 pl-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={24}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-80">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={toggleFilters}
                className="w-full flex items-center justify-between p-4 font-semibold text-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
              >
                <span>Filters</span>
                {isFilterOpen ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
              {isFilterOpen && (
                <div className="p-6 border-t border-gray-200 space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <DollarSign size={20} className="mr-2 text-blue-500" />
                      Price Range
                    </h3>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Calendar size={20} className="mr-2 text-blue-500" />
                      Date Range
                    </h3>
                    <Calender
                      onChange={handleDateChange}
                      selectedRange={dateRange}
                      onClear={clearDateFilter}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <MapPin size={20} className="mr-2 text-blue-500" />
                      Destinations
                    </h3>
                    <div className="space-y-2">
                      {destinationData.map((dest, idx) => (
                        <label
                          key={idx}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-400"
                            checked={selectedDestinations.includes(dest)}
                            onChange={() => {
                              setSelectedDestinations(
                                selectedDestinations?.includes(dest)
                                  ? selectedDestinations?.filter(
                                      (d) => d !== dest
                                    )
                                  : [...selectedDestinations, dest]
                              );
                            }}
                          />
                          <span className="text-gray-700">{dest}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white mt-10 rounded-lg shadow-lg overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 py-2 px-4 text-center font-semibold ${
                    activeTab === "all"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Trips
                </button>
                <button
                  onClick={() => setActiveTab("my")}
                  className={`flex-1 py-2 px-4 text-center font-semibold ${
                    activeTab === "my"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  My Trips
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              {activeTab === "all" ? "All Trips" : "My Trips"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips?.map((trip, idx) => (
                <TripCard
                  key={idx}
                  destination={trip.destination}
                  price={trip.price}
                  startDate={trip.start_date}
                  endDate={trip.end_date}
                  description={trip.descp}
                  picture={trip.picture}
                  onBookNow={() => handleBookNow(trip)}
                  isBooked={activeTab === "my"}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      {isBookingModalOpen && selectedTrip && (
        <BookingModal
          trip={selectedTrip}
          userData={userData}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Home;
