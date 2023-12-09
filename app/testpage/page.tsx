"use client"
import React, { useState }  from 'react'
import Image from 'next/image'
import myImage from '@/components/images/profile.png'

const EditableForm = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John',
    lname: 'Doe',
    email: 'john@example.com',
    
  });

  const handleToggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    
    <div className="flex flex-col justify-left items-left relative md:left-[5rem] md:top-[10rem]">
         <h2 className='text-white text-4xl font-semibold'>TSwift2013's Profile</h2>

         <Image
            className="text-white text-center rounded-full"
            width={150}
            height={150}
            alt="User Profile"
            src={myImage}
          />

        <form className='border-b-2 border-gray-400 bg-transparent '>
        <label className='text-white' htmlFor="name">Name: </label>
        <p></p>

        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          readOnly={!isEditable}
          onChange={handleInputChange}
          className='w-100'
        />

        <button className="text-white" type="button" onClick={handleToggleEdit}>
          {isEditable ? '✎ᝰ' : '✎'}
        </button>
        </form>


        <form className='border-b-2 border-gray-400 bg-transparent '>
        <label className='text-white' htmlFor="name">Last Name: </label>
        <p></p>
        <input
          type="text"
          id="lname"
          name="lname"
          value={formData.lname}
          readOnly={!isEditable}
          onChange={handleInputChange}
          className='w-100'
        />

        <button className="text-white" type="button" onClick={handleToggleEdit}>
          {isEditable ? '✎ᝰ' : '✎'}
        </button>
        </form>

        
        <form className='border-b-2 border-gray-400 bg-transparent md:left-[5rem]'>
        <label className='text-white' htmlFor="name">Email:</label>
        <p></p>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          readOnly={!isEditable}
          onChange={handleInputChange}
          className='w-100'
        />

        <button className="text-white" type="button" onClick={handleToggleEdit}>
          {isEditable ? '✎ᝰ' : '✎'}
        </button>
        </form>

    </div>
  );
};

export default EditableForm;