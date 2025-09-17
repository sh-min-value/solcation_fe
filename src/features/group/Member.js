import React from 'react';
import { EmojiProvider, Emoji } from 'react-apple-emojis';
import emojiData from 'react-apple-emojis/src/data.json';

const Member = ({
  userName,
  userRole,
  showIcon = false,
  icon: IconComponent,
  className = '',
}) => {
  return (
    <div
      className={`bg-white backdrop-blur-sm rounded-3xl p-2 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] transition-all duration-200 cursor-pointer transform hover:-translate-y-1 h-16 flex flex-row items-center space-x-4 ${className}`}
    >
      {/* 프로필 사진 */}
      <div className="bg-light-blue w-11 h-11 rounded-full ml-3 shadow-[0_0_10px_rgba(0,0,0,0.2)] flex items-center justify-center">
        <EmojiProvider data={emojiData}>
          <Emoji name="spiral-shell" size={10} className="w-8 h-8"></Emoji>
        </EmojiProvider>
      </div>

      {/* 사용자 정보 */}
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-bold text-third truncate max-w-[5.5rem]">
            {userName}
          </h3>
          <span className="text-third">|</span>
          {/* 아이콘 표시 */}
          {showIcon && IconComponent && (
            <div className="ml-2">
              <IconComponent size={15} className="inline-block text-group-1" />
            </div>
          )}
          <span className="text-medium text-third">{userRole}</span>
        </div>
      </div>
    </div>
  );
};

export default Member;
