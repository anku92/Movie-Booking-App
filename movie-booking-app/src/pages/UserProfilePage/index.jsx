import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isEditMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user_id = localStorage.getItem('user_id');
        const access_token = localStorage.getItem('access_token');
        const response = await axios.get(`http://127.0.0.1:8000/api/users/${user_id}/`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (response.status === 200) {
          setProfile(response.data);
          setEditedProfile(response.data);
        } else {
          console.error('Error fetching user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedProfile(profile);
  };

  const handleSaveEdit = async () => {
    try {
      const user_id = localStorage.getItem('user_id');
      const access_token = localStorage.getItem('access_token');
      await axios.put(`http://127.0.0.1:8000/api/users/${user_id}/`, editedProfile, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setEditMode(false);
      setProfile(editedProfile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          {loading ? (
            <div>
              <div className="spinner-grow text-primary spinner-grow-sm" role="status"></div>
              <div className="spinner-grow text-primary spinner-grow-sm" role="status"></div>
              <div className="spinner-grow text-primary spinner-grow-sm" role="status"></div>
            </div>
          ) : profile && !isEditMode ? (
            <div className="card">
              <div className="card-header">
                <h2 className="mb-0">User Profile</h2>
              </div>
              <div className="card-body text-light">
                <p className="card-text">
                  <strong>Name:</strong> {profile.name}
                </p>
                <p className="card-text">
                  <strong>Email:</strong> {profile.email}
                </p>
                <p className="card-text">
                  <strong>Username:</strong> {profile.username}
                </p>
                <p className="card-text">
                  <strong>Password:</strong> ********
                </p>
                <p className="card-text">
                  <strong>Mobile:</strong> {profile.mobile}
                </p>
                <p className="card-text">
                  <strong>Date of Birth:</strong> {profile.date_of_birth}
                </p>
                <p className="card-text">
                  <strong>Address:</strong> {profile.address}
                </p>
              </div>
              <div className="card-body">
                <button className="btn btn-primary mb-2" onClick={handleEdit}>
                  Edit Profile
                </button>
              </div>
            </div>
          ) : profile && isEditMode ? (
            <div className="card">
              <div className="card-header">
                <h2 className="mb-0">Edit Profile</h2>
              </div>
              <div className="card-body text-light">
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={editedProfile.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={editedProfile.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="username">Username:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={editedProfile.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password:</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={editedProfile.password || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="mobile">Mobile:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="mobile"
                        name="mobile"
                        value={editedProfile.mobile}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="date_of_birth">Date of Birth:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="date_of_birth"
                        name="date_of_birth"
                        value={editedProfile.date_of_birth}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Address:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={editedProfile.address}
                        onChange={handleChange}
                      />
                    </div>
                <button className="btn btn-primary mr-2" onClick={handleSaveEdit}>
                  Save
                </button>
                <button className="btn btn-secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p>Error loading profile</p>
          )}
          <div className="mt-3">
            <Link to="/" className="btn btn-outline-primary">
              Go to Home
            </Link>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
};

export default UserProfilePage;