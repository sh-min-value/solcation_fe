import React from 'react';
import { CheckCircle2, Bell, Crown } from 'lucide-react';

const Badge = ({ type }) => {
  if (type === 'LEADER')
    return (
      <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        <Crown className="mr-1 h-4 w-4" /> 개설자
      </span>
    );
  if (type === 'MEMBER')
    return (
      <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        <CheckCircle2 className="mr-1 h-4 w-4" /> 멤버
      </span>
    );
  if (type === 'PENDING')
    return (
      <span className="ml-2 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
        <Bell className="mr-1 h-4 w-4" /> 수락 대기중
      </span>
    );
  return null;
};

export default Badge;
