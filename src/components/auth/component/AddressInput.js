import React from 'react';
import { useEffect, useState } from 'react';
import InputForm from './InputForm';
import PostCodeModal from './PostCodeModal';

const AddressInput = ({ updateFormDataFunc, updateValidation }) => {
  const [postalCode, setPostalCode] = useState('');
  const [streetAddr, setStreetAddr] = useState('');
  const [addrDetail, setAddrDetail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* 주소 입력 상태 */
  const [addrDetailError, setAddrDetailError] = useState('');

  /* 전체 유효성 검사 및 부모 컴포넌트로 상태 전달 */
  useEffect(() => {
    const hasError = !!addrDetailError;
    const isComplete = !!(postalCode && streetAddr && addrDetail);

    updateValidation?.({
      hasError,
      isComplete,
    });

    /* 폼 데이터 업데이트 */
    updateFormDataFunc?.('postalCode', postalCode);
    updateFormDataFunc?.('streetAddr', streetAddr);
    updateFormDataFunc?.('addrDetail', addrDetail);
  }, [postalCode, streetAddr, addrDetail, addrDetailError]);

  // 주소 검색 완료 처리
  const handleComplete = data => {
    let addr = ''; // 주소 변수
    let extraAddr = ''; // 참고항목 변수

    // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
    if (data.userSelectedType === 'R') {
      // 사용자가 도로명 주소를 선택했을 경우
      addr = data.roadAddress;
    } else {
      // 사용자가 지번 주소를 선택했을 경우(J)
      addr = data.jibunAddress;
    }

    // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
    if (data.userSelectedType === 'R') {
      // 법정동명이 있을 경우 추가한다. (법정리는 제외)
      if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
        extraAddr += data.bname;
      }
      // 건물명이 있고, 공동주택일 경우 추가한다.
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraAddr +=
          extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
      }
      // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
      if (extraAddr !== '') {
        extraAddr = ' (' + extraAddr + ')';
      }
    }

    // 우편번호와 주소 정보를 상태에 저장
    setPostalCode(data.zonecode);
    setStreetAddr(addr + extraAddr);
    setIsModalOpen(false);
  };

  // 상세주소 유효성 검사
  useEffect(() => {
    if (addrDetail.trim() === '') {
      setAddrDetailError('상세주소를 입력해주세요.');
    } else {
      setAddrDetailError('');
    }
  }, [addrDetail]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 우편번호 */}
      <div className="w-full flex flex-col">
        <div className="mb-1 font-md text-md text-white ml-1">우편번호</div>
        <div className="w-full bg-white rounded-2xl p-4 py-2 pr-2 shadow-sm flex flex-row items-center">
          <input
            type="text"
            placeholder="우편번호"
            className="w-full text-lg border-none outline-none bg-transparent text-gray-600"
            value={postalCode}
            readOnly
          />
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 text-sm rounded-xl transition-colors whitespace-nowrap h-8 w-24 bg-third hover:bg-blue text-white"
          >
            주소검색
          </button>
        </div>
      </div>

      {/* 주소 */}
      <div className="w-full flex flex-col">
        <div className="mb-1 font-md text-md text-white ml-1">주소</div>
        <div className="w-full bg-white rounded-2xl p-4 py-2 shadow-sm">
          <input
            type="text"
            placeholder="주소"
            className="w-full text-lg border-none outline-none bg-transparent text-gray-600"
            value={streetAddr}
            readOnly
          />
        </div>
      </div>

      {/* 상세주소 */}
      <InputForm
        value={addrDetail}
        onChange={setAddrDetail}
        placeholder={'상세주소를 입력하세요 (예: 101동 1202호)'}
        maxLength={50}
        title={'상세주소'}
        error={addrDetailError}
      />

      {/* 주소 검색 모달 */}
      <PostCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default AddressInput;
