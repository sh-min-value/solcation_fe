import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BriefAccount from './BriefAccount';
import { AccountAPI } from '../../services/AccountAPI';
import { GroupAPI } from '../../services/GroupAPI';
import { useAuth } from '../../context/AuthContext';
import emptySol from '../../assets/images/empty_sol.svg';

const Account = () => {
  const navigate = useNavigate();
  const { groupid } = useParams();
  const { user } = useAuth();
  const [accountInfo, setAccountInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGroupLeader, setIsGroupLeader] = useState(false);
  const [groupLeaderName, setGroupLeaderName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [isGroupInfoLoading, setIsGroupInfoLoading] = useState(true);

  const buttonClass =
    'bg-light-blue text-main px-6 py-2 rounded-lg hover:bg-light-blue/80 transition-colors';

  // 모임통장 정보 조회
  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!groupid) return;

      try {
        setIsLoading(true);
        const response = await AccountAPI.getAccountInfo(groupid);

        // 성공 응답인 경우
        if (response.success) {
          setAccountInfo(response.data);
          setError(null);
        } else {
          // 계좌가 없는 경우
          setAccountInfo(null);
          setError(response.error);
        }
      } catch (error) {
        console.error('모임통장 정보 조회 실패:', error);
        setAccountInfo(null);
        setError({
          code: error.response?.error?.code || 500,
          message:
            error.response?.error?.message || '서버 오류가 발생했습니다.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountInfo();
  }, [groupid]);

  // 그룹 정보 조회 및 리더 여부 확인
  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!groupid) return;

      try {
        setIsGroupInfoLoading(true);
        const [membersResponse, groupResponse] = await Promise.all([
          GroupAPI.getGroupMembers(groupid),
          GroupAPI.getGroup(groupid),
        ]);

        // 현재 사용자가 그룹 리더인지 확인
        const isLeader = user?.userId
          ? membersResponse.groupLeader?.userId === user.userId
          : false;

        setIsGroupLeader(isLeader);
        setGroupLeaderName(membersResponse.groupLeader?.userName || '');
        setGroupName(groupResponse.groupName || '');
      } catch (error) {
        console.error('그룹 정보 조회 실패:', error);
        setIsGroupLeader(false);
        setGroupLeaderName('');
        setGroupName('');
      } finally {
        setIsGroupInfoLoading(false);
      }
    };

    fetchGroupInfo();
  }, [groupid, user?.userId]);

  // 로딩 중
  if (isLoading || isGroupInfoLoading) {
    return null;
  }

  // 계좌가 없는 경우
  if (!accountInfo && error?.code === 40001) {
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
            <button
              onClick={() => {
                /* 개설요청 로직 */
              }}
              className={buttonClass}
            >
              모임통장 개설 요청하기
            </button>
          </div>
        )}
      </div>
    );
  }

  // 모임통장 보유 시
  return <BriefAccount balance={248688} />;
};

export default Account;
