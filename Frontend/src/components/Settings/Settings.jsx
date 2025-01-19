import React, { useState, useId } from 'react';
import { Eye, EyeOff, Upload, Hospital, Phone, MapPin, Mail, User, Camera } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../store/authSlice';
import { useForm } from 'react-hook-form'
import axios from 'axios';

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

const Input = React.forwardRef(({ 
  icon: Icon, 
  label, 
  type = "text", 
  defaultValue = "",
  name,
  onChange,
  onBlur,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();

  const handleClick = (e) => {
    e.target.select();
  };

  return (
    <div className="mb-4">
      <label 
        className="block text-sm font-medium text-gray-600 mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={id}
          name={name}
          ref={ref}
          type={type}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition duration-150 ease-in-out ${
            isFocused ? 'bg-white' : 'bg-blue-50'
          }`}
          defaultValue={defaultValue}
          onClick={handleClick}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          onChange={onChange}
          {...props}
        />
      </div>
    </div>
  );
});

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const hospital = useSelector((state) => state.auth.hospital);
  const [imagePreview, setImagePreview] = useState(hospital.avatar);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: hospital.name,
      address: hospital.address,
      phone: hospital.phone,
      email: hospital.email
    }
  });
  const [password, setPassword] = useState(
    {
      newPassword: '',
      currentPassword: ''
    }
  )

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await axios.patch("/api/v1/hospitals/update-profile", data);
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.log("Error updating profile details:", error);
    }
  };

  const handlePasswordChange = (e)=>{
    const {name, value} = e.target;
    setPassword((prev)=>({
      ...prev,
      [name]: value
    }))
  }

  const changePassword = async()=>{
    try {
      await axios.patch("/api/v1/hospitals/change-password", password)
      .then((response)=>{
        if(response.data.success){
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false);
          }, 3000);
        }
      })
      .catch((error)=>{
        console.log("Error updating the password, ERROR: ", error);
      })
    } catch (error) {
      console.log("Error updating the password, ERROR: ", error);
    }
  }

  return (
    <div className="min-h-screen bg-[#fff4ec] py-8 font-serif">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="pb-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your hospital profile and account settings</p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Profile Image Section */}
          <div className="bg-gray-50 rounded-xl shadow-sm p-8 border border-gray-100">
            <SectionHeader 
              title="Profile Image" 
              subtitle="Update your hospital profile picture" 
            />
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer">
                  <Camera className="h-8 w-8 text-white" />
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Upload new image</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (Max. 2MB)</p>
              </div>
            </div>
          </div>

          {/* Hospital Profile Section */}
          <form onSubmit={handleSubmit(updateProfile)} className="bg-gray-50 rounded-xl shadow-sm p-8 border border-gray-100">
            <SectionHeader 
              title="Hospital Profile" 
              subtitle="Update your hospital information" 
            />
            <div className="space-y-4">
              <Input
                icon={Hospital}
                label="Hospital Name"
                {...register("name", {
                  required: "Hospital name is required"
                })}
              />
              <Input
                icon={MapPin}
                label="Address"
                {...register("address", {
                  required: "Address is required"
                })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  icon={Phone}
                  label="Phone Number"
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Phone number must be 10 digits"
                    }
                  })}
                />
                <Input
                  icon={Mail}
                  label="Email Address"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email address"
                    }
                  })}
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full sm:w-auto flex px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </form>

          <div className="bg-gray-50 rounded-xl shadow-sm p-8 border border-gray-100">
            {/* Password Section  */}
            <SectionHeader 
              title="Password" 
              subtitle="Update your account password" 
            />
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Current Password
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="block w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    value={password.currentPassword}
                    name='currentPassword'
                    onChange={handlePasswordChange}
                    onClick={(e) => e.target.select()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  New Password
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="block w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    name='newPassword'
                    value={password.newPassword}
                    onChange={handlePasswordChange}
                    onClick={(e) => e.target.select()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-4">
                <button 
                className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                onClick={changePassword}
                >
                  Update Password
                </button>

                {showNotification && (
                  <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform transition-all duration-300 ease-out">
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Password updated successfully!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;