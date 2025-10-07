import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SignatureCanvas from 'react-signature-canvas';
import InputField from './InputField';
import { useAuth } from '../../../context/AuthContext';

// 계정 정보 입력 폼 컴포넌트
const AccountInfoForm = ({ formData, updateFormData, errors, userProfile }) => {
  const sigPad = useRef();
  const { user } = useAuth();

  // 전화번호 파싱
  const parsePhoneNumber = phone => {
    if (!phone) return { first: '', second: '', third: '' };
    const cleaned = phone.replace(/\D/g, '');
    return {
      first: cleaned.slice(0, 3),
      second: cleaned.slice(3, 7),
      third: cleaned.slice(7, 11),
    };
  };

  // 상태 관리
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(parsePhoneNumber(user?.tel));

  // 주소 정보 설정
  useEffect(() => {
    if (userProfile) {
      const addressData = userProfile.data || userProfile;
      if (addressData) {
        const fullAddress = `${addressData.address || ''} ${
          addressData.addressDetail || ''
        } ${addressData.postCode || ''}`.trim();
        setAddress(fullAddress);
        updateFormData('address', fullAddress);
      }
    }
  }, [userProfile]);

  // 전화번호 입력
  const handlePhoneNumberChange = (part, value) => {
    const newPhoneNumber = { ...phoneNumber, [part]: value };
    setPhoneNumber(newPhoneNumber);
    updateFormData('phoneNumber', newPhoneNumber);
  };

  // 주소 입력
  const handleAddressChange = value => {
    setAddress(value);
    updateFormData('address', value);
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 space-y-4">
      {/* 계정 이름 입력 */}
      <InputField
        id="account-name"
        label="이름"
        placeholder="계정 이름"
        value={user?.userName || ''}
        onChange={() => {}}
        error={errors.accountName}
        disabled={true}
      />

      {/* 주소 표시 */}
      <InputField
        id="address"
        label="주소"
        placeholder="주소"
        value={address}
        onChange={() => {}}
        error={errors.address}
        disabled={true}
      />

      {/* 전화번호 입력 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label
            htmlFor="phone-number"
            className="text-gray04 text-lg font-medium"
          >
            전화번호
          </label>
          {errors.phoneNumber && (
            <span className="text-group-1 text-[10px]">
              {errors.phoneNumber}
            </span>
          )}
        </div>
        <div id="phone-number" className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="010"
              maxLength={3}
              className="w-full text-lg border-none outline-none bg-transparent text-white text-left placeholder-gray04 px-1 py-2 opacity-100 cursor-default"
              value={phoneNumber.first}
              disabled={true}
            />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-blue"></div>
          </div>
          <span className="text-white text-sm">-</span>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="1234"
              maxLength={4}
              className="w-full text-lg border-none outline-none bg-transparent text-white text-left placeholder-gray04 px-1 py-2 opacity-100 cursor-default"
              value={phoneNumber.second}
              disabled={true}
            />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-blue"></div>
          </div>
          <span className="text-white text-sm">-</span>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="5678"
              maxLength={4}
              className="w-full text-lg border-none outline-none bg-transparent text-white text-left placeholder-gray04 px-1 py-2 opacity-100 cursor-default"
              value={phoneNumber.third}
              disabled={true}
            />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-blue"></div>
          </div>
        </div>
      </div>

      {/* 서명 입력 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label
            htmlFor="signature"
            className="text-gray04 text-lg font-medium"
          >
            서명
          </label>
          {errors.signature && (
            <span className="text-group-1 text-[10px]">{errors.signature}</span>
          )}
        </div>
        <SignatureCanvas
          ref={sigPad}
          canvasProps={{
            className: 'w-full border-none rounded-lg',
            width: 300,
            height: 120,
          }}
          backgroundColor="white"
          penColor="black"
          minWidth={1}
          maxWidth={3}
          velocityFilterWeight={0.7}
          onEnd={() => {
            if (sigPad.current && !sigPad.current.isEmpty()) {
              const dataURL = sigPad.current.toDataURL('image/png');
              updateFormData('signature', dataURL);
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            sigPad.current?.clear();
            updateFormData('signature', null);
          }}
          className="mt-1 px-3 py-1 text-sm text-black border border-gray04 rounded hover:bg-gray04 hover:text-black transition-colors ml-auto block"
        >
          초기화
        </button>
      </div>
    </div>
  );
};

AccountInfoForm.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  userProfile: PropTypes.object,
};

export default AccountInfoForm;
