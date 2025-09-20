import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BriefAccount from './BriefAccount';
import TransactionHistory from './components/TransactionHistory';
import { AccountAPI } from '../../services/AccountAPI';
import { useAuth } from '../../context/AuthContext';
import emptySol from '../../assets/images/empty_sol.svg';
import Loading from '../../components/common/Loading';

const Account = () => {
  const navigate = useNavigate();
  const { groupid } = useParams();
  const { user } = useAuth();
  const [accountInfo, setAccountInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExist, setIsExist] = useState(true);
  const [isGroupLeader, setIsGroupLeader] = useState(false);
  const [groupLeaderName, setGroupLeaderName] = useState('');
  const [groupName, setGroupName] = useState('');

  const buttonClass =
    'bg-light-blue text-main px-6 py-2 rounded-lg hover:bg-light-blue/80 transition-colors';

  // 모임통장 정보 조회
  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!groupid) return;

      try {
        setIsLoading(true);
        const response = await AccountAPI.getAccountInfo(groupid);
        console.log(response);

        setAccountInfo(response.data);

        //그룹 정보 저장
        if (response.leaderPk === user?.userPk) {
          setIsGroupLeader(true);
        }

        setGroupLeaderName(response.leaderName);
        setGroupName(response.groupName);

        //계좌 존재 여부 저장
        setIsExist(response.saPk !== null);
      } catch (error) {
        console.error('모임통장 정보 조회 실패:', error.response.error);
        const { code, message } = error.response.error;

        //todo: 에러 넘기기
        setAccountInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountInfo();
  }, [groupid]);

  // 로딩 중
  if (isLoading) {
    return <Loading />;
  }

  // 계좌가 없는 경우
  if (!isExist) {
    return (
      <div className="text-center pt-20 justify-center items-center">
        <img
          src={emptySol}
          alt="No Account"
          className="w-[240px] h-[240px] mx-auto mb-6"
        />
        <div className="text-black text-lg mb-2">
          앗, 아직 모임통장이 없어요!
        </div>
        {isGroupLeader ? (
          <div>
            <p className="text-black text-lg mb-6">
              <span className="font-bold">&ldquo;{groupName}&rdquo;</span>의
              모임통장을 개설해보세요.
            </p>
            <button
              onClick={() => navigate(`/group/${groupid}/account/new`)}
              className={buttonClass}
            >
              모임통장 만들기
            </button>
          </div>
        ) : (
          <div>
            <p className="text-black text-lg mb-6">
              {groupLeaderName ? (
                <>
                  <span className="font-bold">
                    &ldquo;{groupLeaderName}&rdquo;
                  </span>
                  님에게 개설을 요청해보세요.
                </>
              ) : (
                <>
                  <span className="font-bold">그룹장</span>에게 개설을
                  요청해보세요.
                </>
              )}
            </p>
            <button onClick={() => {}} className={buttonClass}>
              모임통장 개설 요청하기
            </button>
          </div>
        )}
      </div>
    );
  }

  // 모임통장 보유 시
  return (
    <div className="h-screen overflow-y-auto pb-96">
      <div className="px-4 pt-4">
        <BriefAccount groupId={groupid} />
      </div>
      <TransactionHistory groupId={groupid} />
    </div>
  );
};

export default Account;
