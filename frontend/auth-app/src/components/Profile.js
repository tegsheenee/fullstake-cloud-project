import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [image, setImage] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('User not logged in.');
            return;
        }

        try {
            const decoded = atob(token).split(':');
            const email = decoded[0];
            const timestamp = decoded[1];

            setUser({ email, timestamp });
            setImage(localStorage.getItem('profileImageUrl')); // Get profile image URL from localStorage
        } catch (err) {
            setError('Error decoding token: ' + err.message);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('profileImageUrl');
        window.location.href = '/'; // Redirect to login page
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // Create a URL for the selected file
            setNewImage(file);
            setImage(previewUrl); // Update the image preview
        }
    };

    const uploadImage = async () => {
        if (!newImage) {
            setMessage('Please select an image to upload.');
            return;
        }

        setUploading(true);
        setMessage('');

        const token = localStorage.getItem('authToken');
        const email = atob(token).split(':')[0];
        const oldImageUrl = localStorage.getItem('profileImageUrl'); // Retrieve the old image URL
        const oldImageKey = oldImageUrl.split('/').pop(); // Extract the key from the URL
        const uniqueFilename = `${Date.now()}_${newImage.name}`;
        const contentType = newImage.type;

        try {
            // Call the backend to update the profile image
            const response = await axios.put('https://ynw120kvuh.execute-api.us-east-1.amazonaws.com/k-prod/updateProfileImage', {
                email,
                oldImageKey,
                newFilename: uniqueFilename,
                newContentType: contentType
            });

            const { uploadURL } = response.data;

            // Upload the new image to S3 using the pre-signed URL
            await axios.put(uploadURL, newImage, {
                headers: { 'Content-Type': newImage.type },
            });

            // Update local storage and state
            const updatedImageUrl = `https://k-storage-images.s3.amazonaws.com/${uniqueFilename}`;
            localStorage.setItem('profileImageUrl', updatedImageUrl);
            setImage(updatedImageUrl);
            setMessage('Image uploaded successfully!');
        } catch (error) {
            console.error('Image upload error:', error);
            setMessage('Image upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {error && <p className="error">{error}</p>}
            {user && (
                <div className="user-info">
                    <p>Email: {user.email}</p>
                    <p>Created Date: {user.timestamp}</p>
                    <div className="image-preview">
                        <h3>Profile Image:</h3>
                        <img src={image} alt="Profile" className="profile-image" />
                    </div>
                </div>
            )}
            <input type="file" onChange={handleImageChange} />
            <button onClick={uploadImage} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Update Profile Image'}
            </button>
            {message && <p>{message}</p>}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Profile;
