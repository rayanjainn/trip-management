import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus, Users, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const AdminPanel = ({ isAdmin, setIsAdmin }) => {
  const [activeTab, setActiveTab] = useState("trips");
  const [trips, setTrips] = useState([]);
  const [agents, setAgents] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editingAgent, setEditingAgent] = useState(null);
  const [showTripForm, setShowTripForm] = useState(false);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-signin");
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchTrips();
    fetchAgents();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/trips`);
      if (!response.ok) throw new Error("Failed to fetch trips");
      const data = await response.json();
      setTrips(data.trips);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/agents`);
      if (!response.ok) throw new Error("Failed to fetch agents");
      const data = await response.json();
      setAgents(data.agents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTripSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const tripData = {
      destination: formData.get("destination"),
      price: parseFloat(formData.get("price")),
      startdate: formData.get("startDate"),
      enddate: formData.get("endDate"),
      desc: formData.get("description"),
      picture: formData.get("pictureLink"),
    };

    try {
      let response;
      if (editingTrip) {
        response = await fetch(
          `http://localhost:3000/api/admin/updatetrip/${editingTrip.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tripData),
          }
        );
      } else {
        response = await fetch(`http://localhost:3000/api/admin/addtrip`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tripData),
        });
      }

      if (!response.ok) throw new Error("Failed to save trip");
      await fetchTrips();
      setEditingTrip(null);
      setShowTripForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAgentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const agentData = {
      username: formData.get("name"),
      tripId: parseInt(formData.get("tripId")),
      email: formData.get("email"),
      phonenum: formData.get("phoneNumber"),
      rating: parseFloat(formData.get("rating")),
      password: formData.get("password"),
    };

    try {
      let response;
      if (editingAgent) {
        response = await fetch(`http://localhost:3000/api/admin/addagent`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(agentData),
        });
      } else {
        response = await fetch(`http://localhost:3000/api/admin/addagent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(agentData),
        });
      }

      if (!response.ok) throw new Error("Failed to save agent");
      await fetchAgents();
      setEditingAgent(null);
      setShowAgentForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/admin/deletetrip/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete trip");
      await fetchTrips();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.AGENTS_ENDPOINT}/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete agent");
      await fetchAgents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ErrorMessage = ({ message, onDismiss }) => (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
      <p className="flex items-center">
        <span>{message}</span>
        <button onClick={onDismiss} className="ml-4 font-bold">
          ×
        </button>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      <div className="p-8 max-w-6xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("trips")}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              activeTab === "trips"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Map className="mr-2 h-4 w-4" />
            Trips
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              activeTab === "agents"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Users className="mr-2 h-4 w-4" />
            Agents
          </button>
        </div>

        {/* Trips Section */}
        {activeTab === "trips" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Trips</h2>
              <button
                onClick={() => setShowTripForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Trip
              </button>
            </div>

            {/* Trip Form */}
            {showTripForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">
                    {editingTrip ? "Edit Trip" : "Add New Trip"}
                  </h3>
                  <form onSubmit={handleTripSubmit} className="space-y-4">
                    <input
                      name="destination"
                      placeholder="Destination"
                      defaultValue={editingTrip?.destination}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="price"
                      type="number"
                      placeholder="Price"
                      defaultValue={editingTrip?.price}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        name="startDate"
                        type="date"
                        defaultValue={editingTrip?.startdate}
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        name="endDate"
                        type="date"
                        defaultValue={editingTrip?.enddate}
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <textarea
                      name="description"
                      placeholder="Description"
                      defaultValue={editingTrip?.descp}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="pictureLink"
                      placeholder="Picture Link"
                      defaultValue={editingTrip?.picture}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowTripForm(false);
                          setEditingTrip(null);
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                        disabled={loading}
                      >
                        {loading && <LoadingSpinner />}
                        {editingTrip ? "Update" : "Add"} Trip
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Trips Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={trip.picture}
                    alt={trip.destination}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">
                          {trip.destination}
                        </h3>
                        <p className="text-lg font-semibold text-blue-600">
                          ${trip.price}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTrip(trip);
                            setShowTripForm(true);
                          }}
                          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteTrip(trip.id)}
                          className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        Start: {new Date(trip.start_date).toLocaleDateString()}
                      </p>
                      <p>End: {new Date(trip.end_date).toLocaleDateString()}</p>
                    </div>
                    <p className="mt-2 text-gray-600">{trip.descp}</p>
                  </div>
                </div>
              ))}
            </div>

            {trips.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                No trips found. Add your first trip!
              </div>
            )}
          </div>
        )}

        {/* Agents Section */}
        {activeTab === "agents" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Agents</h2>
              <button
                onClick={() => setShowAgentForm(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                disabled={loading}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
              </button>
            </div>

            {/* Agent Form */}
            {showAgentForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">
                    {editingAgent ? "Edit Agent" : "Add New Agent"}
                  </h3>
                  <form onSubmit={handleAgentSubmit} className="space-y-4">
                    <input
                      name="name"
                      placeholder="Name"
                      defaultValue={editingAgent?.name}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      name="tripId"
                      type="number"
                      placeholder="Trip ID"
                      defaultValue={editingAgent?.tripId}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      name="email"
                      type="email"
                      placeholder="Email"
                      defaultValue={editingAgent?.email}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      name="phoneNumber"
                      type="tel"
                      placeholder="Phone Number"
                      defaultValue={editingAgent?.phoneNumber}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      name="rating"
                      type="number"
                      step="0.1"
                      placeholder="Rating"
                      defaultValue={editingAgent?.rating}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      name="password"
                      type="password"
                      placeholder="Password"
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAgentForm(false);
                          setEditingAgent(null);
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
                        disabled={loading}
                      >
                        {loading && <LoadingSpinner />}
                        {editingAgent ? "Update" : "Add"} Agent
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Agents Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{agent.name}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAgent(agent);
                            setShowAgentForm(true);
                          }}
                          className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteAgent(agent.id)}
                          className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600">Email: {agent.email}</p>
                    <p className="text-gray-600">Phone: {agent.phonenum}</p>
                    <p className="text-gray-600">Rating: {agent.rating}</p>
                  </div>
                </div>
              ))}
            </div>

            {agents.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                No agents found. Add your first agent!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
