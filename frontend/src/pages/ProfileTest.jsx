import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/axios';
import toast from 'react-hot-toast';

const ProfileTest = () => {
  const { user, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  console.log('✅✅✅ ProfileTest Component Loaded!');
  console.log('User:', user);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name);

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const data = await userAPI.uploadAvatar(formData);
      console.log('Upload success:', data);
      updateProfile({ ...user, avatar: data.data.avatar });
      toast.success('تم رفع الصورة بنجاح! 📸');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'فشل رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Profile Test Page</h1>
        
        <div className="bg-dark-light p-6 rounded-lg mb-6">
          <h2 className="text-2xl mb-4">User Info</h2>
          <p className="mb-2"><strong>Name:</strong> {user?.name || 'N/A'}</p>
          <p className="mb-2"><strong>Email:</strong> {user?.email || 'N/A'}</p>
          <p className="mb-2"><strong>Role:</strong> {user?.role || 'N/A'}</p>
        </div>

        <div className="bg-dark-light p-6 rounded-lg mb-6">
          <h2 className="text-2xl mb-4">Current Avatar</h2>
          <img 
            src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=200'} 
            alt="Avatar" 
            className="w-32 h-32 rounded-full mb-4"
          />
        </div>

        <div className="bg-dark-light p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Upload New Avatar</h2>
          
          <input
            type="file"
            id="test-avatar-upload"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-white bg-dark p-3 rounded border border-primary mb-4"
          />
          
          <button
            onClick={() => document.getElementById('test-avatar-upload').click()}
            disabled={uploading}
            className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {uploading ? 'جاري الرفع...' : 'اختر صورة'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTest;
