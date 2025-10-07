import React from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import emptySol from '../../assets/images/empty_sol.svg';

const EmptyCard = () => {
  const { groupData, triggerRefresh } = useOutletContext();
  const navigate = useNavigate();
  const { groupid } = useParams();
  const buttonClass =
    'bg-light-blue text-main px-6 py-2 rounded-lg hover:bg-light-blue/80 transition-colors';

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center justify-center items-center">
        <img
          src={emptySol}
          alt="No Account"
          className="w-[240px] h-[240px] mx-auto mb-6"
        />
        <div className="text-black text-lg mb-2">
          앗, 아직 개설된 카드가 없어요!
        </div>
        <div>
          <p className="text-black text-lg mb-6">
            <span className="font-bold">
              &ldquo;{groupData?.groupName}&rdquo;
            </span>
            의 카드를 개설해보세요.
          </p>
          <button
            onClick={() => navigate(`/group/${groupid}/account/card/new`)}
            className={buttonClass}
          >
            모임통장 카드 개설하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyCard;
