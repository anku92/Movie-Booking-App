import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import './UserProfilePage.css';
import Endpoints from '../../api/Endpoints';

const UserProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isEditMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    date_of_birth: '',
    username: '',
    password: '',
    email: '',
    mobile: '',
    address: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user_id = localStorage.getItem('user_id');
        const access_token = localStorage.getItem('access_token');
        const response = await axios.get(`${Endpoints.USERS}${user_id}/`, {
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
      await axios.put(`${Endpoints.USERS}${user_id}/`, editedProfile, {
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

  const formatDate = (dateString) => {
    if (!dateString) return "_";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row mt-4 py-3">
          {loading ? (
            <div className="col text-center">
              <div className="spinner-grow text-primary spinner-grow-sm" role="status"></div>
              <div className="spinner-grow text-primary spinner-grow-sm" role="status"></div>
              <div className="spinner-grow text-primary spinner-grow-sm" role="status"></div>
            </div>
          ) : profile ? (
            <>
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-body bg-primary text-center">
                    <FaUser className="img-fluid" color="white" size="120px" />
                    <h5 className="my-3 text-white">{profile.username}</h5>
                    <p className="mb-0">Admin Access: {profile.is_staff && profile.is_superuser ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
              {!isEditMode ? (
                <div className='col-md-8'>
                  <div className="card mb-4">
                    <div className="card-body bg-light">
                    <div className="row">
                        <div className="col-md-5">
                          <strong>Full Name</strong>
                        </div>
                        <div className="col-md-7">
                          <p className="text-muted mb-0">{profile.name}</p>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-5">
                          <strong className="mb-0">DOB</strong>
                        </div>
                        <div className="col-md-7">
                          <p className="text-muted mb-0">{formatDate(profile.date_of_birth)}</p>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-5">
                          <strong>Username</strong>
                        </div>
                        <div className="col-md-7">
                          <p className="text-muted mb-0">{profile.username}</p>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-5">
                          <strong>Password</strong>
                        </div>
                        <div className="col-md-7">
                          <p className="text-muted mb-0">************</p>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-5">
                          <strong>Email</strong>
                        </div>
                        <div className="col-md-7">
                          <p className="text-muted mb-0">{profile.email}</p>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-5">
                          <strong>Mobile</strong>
                        </div>
                        <div className="col-md-7">
                          <p className="text-muted mb-0">
                            {profile.mobile.length === 0 ? "_" : profile.mobile}
                          </p>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-5">
                          <strong>Address</strong>
                        </div>
                        <div className="col-md-7">
                          <p className="text-muted mb-0">
                            {profile.address.length === 0 ? "_" : profile.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={handleEdit}>
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className='col-md-8'>
                  <div className="card mb-4">
                    <div className="card-body bg-light">
                    <div className="row">
                        <div className="col-md-5">
                          <strong>Full Name</strong>
                        </div>
                        <div className="col-md-7">
                          <input type="text" className="form-control form-control-sm mb-0" id="name" name="name" value={editedProfile.name}
                            onChange={handleChange} />
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-5">
                          <strong>DOB</strong>
                        </div>
                        <div className="col-md-7">
                          <input type="date" className="form-control form-control-sm date-picker" id="date_of_birth" name="date_of_birth"
                            value={editedProfile.date_of_birth} onChange={handleChange} />
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-5">
                          <strong>Username</strong>
                        </div>
                        <div className="col-md-7">
                          <input type="text" className="form-control form-control-sm" id="username" name="username" value={editedProfile.username}
                            onChange={handleChange} />
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-5">
                          <strong>Password</strong>
                        </div>
                        <div className="col-md-7">
                          <input type="password" className="form-control form-control-sm" id="password" name="password" value={editedProfile.password
                            || ''} onChange={handleChange} />
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-5">
                          <strong>Email</strong>
                        </div>
                        <div className="col-md-7">
                          <input type="email" className="form-control form-control-sm" id="email" name="email" value={editedProfile.email}
                            onChange={handleChange} />
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-5">
                          <strong>Mobile</strong>
                        </div>
                        <div className="col-md-7">
                          <input type="text" className="form-control form-control-sm" id="mobile" name="mobile" value={editedProfile.mobile}
                            onChange={handleChange} />
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-5">
                          <strong>Address</strong>
                        </div>
                        <div className="col-md-7">
                          <input type="text" className="form-control form-control-sm" id="address" name="address" value={editedProfile.address}
                            onChange={handleChange} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <button className="btn btn-primary mr-2" onClick={handleSaveEdit}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="col text-danger text-center">
              <p className="blockquote">Error loading profile...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;