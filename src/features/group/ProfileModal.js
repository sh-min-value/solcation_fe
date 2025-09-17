import React from 'react';
import { useState } from 'react';

import {
  X,
  Phone,
  Calendar,
  Mail,
  Heart,
  CheckCircle2,
  Bell,
} from 'lucide-react';
import dayjs from 'dayjs';

const Badge = ({ isMember, isPending }) => {
  if (isMember && !isPending)
    return (
      <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        <CheckCircle2 className="mr-1 h-4 w-4" /> 멤버
      </span>
    );
  if (!isMember && isPending)
    return (
      <span className="ml-2 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
        <Bell className="mr-1 h-4 w-4" /> 수락 대기중
      </span>
    );
  return null;
};

const ProfileModal = ({
  groupId,
  isOpen,
  onClose,
  userData,
  showInvitation,
  isMember,
  isPending,
  onInvite = null,
}) => {
  //초대 여부
  const [isInviting, setIsInviting] = useState(false);

  if (!isOpen || !userData) return null;

  const handleInvite = async () => {
    if (!onInvite) return;

    if (userData.tel == null || userData.tel === '') {
      alert('전화번호가 없으면 초대할 수 없어요!');
      return;
    }

    setIsInviting(true);

    try {
      const result = await onInvite(groupId, userData.tel);
      alert('초대가 성공적으로 전송되었어요!');
    } catch (error) {
      console.error('Invitation Error:', error);
      alert('초대 중 오류가 발생했습니다!');
    } finally {
      setIsInviting(false);
      onClose();
    }
  };
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
      {/* 모달 컨테이너 */}
      <div className="bg-white rounded-2xl shadow-2xl w-[80%] max-w-sm mx-auto relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* 모달 내용 */}
        <div className="p-6">
          {/* 프로필 아바타 */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-light-blue to-main rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">
                {userData.userName?.charAt(0) || '?'}
              </span>
            </div>
          </div>

          {/* 이름 */}
          <h2 className="text-xl font-bold text-center text-gray-800 mb-3">
            {userData.userName || '이름 없음'} ({userData.userId || 'ID 없음'})
            <Badge isMember={isMember} isPending={isPending} />
          </h2>

          {/* 연락처 정보 */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 text-gray-600">
              <Phone size={16} className="text-blue-500" />
              <span className="text-sm">TEL</span>
              <span className="text-sm font-medium">
                {userData.tel || '전화번호가 없어요!'}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-gray-600">
              <Calendar size={16} className="text-green-500" />
              <span className="text-sm">BIRTH</span>
              <span className="text-sm font-medium">
                {dayjs(userData.dateOfBirth).format('YYYY.MM.DD') ||
                  '생년월일이 없어요!'}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-gray-600">
              <Mail size={16} className="text-red-500" />
              <span className="text-sm">EMAIL</span>
              <span className="text-sm font-medium break-all">
                {userData.email || '이메일 없음'}
              </span>
            </div>
          </div>

          {/* 초대 버튼 */}
          {showInvitation && !isMember && !isPending && (
            <div className="flex justify-center">
              <button
                onClick={handleInvite}
                disabled={isInviting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors 
                  ${
                    isInviting
                      ? 'bg-gray-3 text-gray-1 cursor-not-allowed'
                      : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                  }`}
              >
                <Heart
                  size={16}
                  className={`${isInviting ? 'none' : 'text-pink-500'}`}
                />
                <span className="text-sm font-medium">
                  {isInviting ? '초대중입니다..' : '초대할까요?'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
