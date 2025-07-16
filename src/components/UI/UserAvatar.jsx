import React from 'react';

const UserAvatar = () => {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden">
      <img 
        src="https://randomuser.me/api/portraits/women/44.jpg" 
        alt="صورة المستخدم" 
        className="w-full h-full object-cover" 
      />
    </div>
  );
};

export default UserAvatar; 