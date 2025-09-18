import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BriefAccount from './BriefAccount';
import RegularDepositModal from './RegularDepositModal';

const Account = () => {
  const navigate = useNavigate();

  return (
    <>
      <BriefAccount balance={248688} />
    </>
  );
};

export default Account;
