import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Outlet,
  useLocation,
  useParams,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import { GroupAPI } from '../../services/GroupAPI';
import { RiSendPlaneFill } from 'react-icons/ri';
import Member from './Member';
import { BiSolidBellRing } from 'react-icons/bi';
import ProfileModal from './ProfileModal';
import Loading from '../../components/common/Loading';

/* 초대 검색바 컴포넌트 */
const SearchBar = React.memo(
  ({ searchTerm, onChange, onClick, placeholder, icon: IconComponent }) => {
    const handleSubmit = useCallback(
      e => {
        e.preventDefault();
        onClick?.(e);
      },
      [onClick]
    );

    const handleChange = useCallback(
      e => {
        onChange(e.target.value);
      },
      [onChange]
    );

    return (
      <div className="mb-5">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder={placeholder || '검색어를 입력하세요'}
            className="w-full px-4 py-2 pr-12 rounded-3xl border-2 border-main focus:outline-none focus:ring-2 focus:ring-main/20"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IconComponent className="w-6 h-6 text-main" />
          </button>
        </form>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

/* 그룹 메인 컴포넌트 */
const Group = () => {
  const { groupData, triggerRefresh } = useOutletContext();
  const location = useLocation();
  const { groupid } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  //멤버 목록
  const [members, setMembers] = useState({
    groupLeader: null,
    members: [],
    waitingList: [],
  });

  //전화번호 검색
  const [searchTerm, setSearchTerm] = useState('');

  //모달 상태 관리
  //유저 정보
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isPending, setIsPending] = useState(false);

  //초대
  const [isInvModalOpen, setIsInvModalOpen] = useState(false);
  const [selectedInvUser, setSelectedInvUser] = useState(null);
  const [isMemberInv, setIsMemberInv] = useState(false);
  const [isPendingInv, setIsPendingInv] = useState(false);

  // 그룹 유효성 검사
  useEffect(() => {
    const validateGroup = async () => {
      try {
        setLoading(true);

        // 그룹 기본 정보 로드
        const groupInfo = await GroupAPI.getGroup(groupid);

        // 그룹 멤버 정보 로드
        const memberInfo = await GroupAPI.getGroupMembers(groupid);

        // 멤버 데이터 설정
        setMembers({
          groupLeader: memberInfo.groupLeader || null,
          members: memberInfo.members || [],
          waitingList: memberInfo.waitingList || [],
        });

        setLoading(false);
      } catch (err) {
        // 에러 발생 시 에러 페이지로 이동
        const errorData = err.response?.error || err;
        navigate('/error', {
          state: {
            error: errorData,
            from: location.pathname,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    validateGroup();
  }, [groupid]);

  //전화번호 확인
  const isValidPhone = useCallback(
    (s = '') => /^\s*(01[016789])\d{3,4}\d{4}\s*$/.test(s),
    []
  );

  // 검색 핸들러
  const handleSearch = useCallback(
    async e => {
      e.preventDefault();
      const q = (searchTerm || '').trim();

      if (!q || !isValidPhone(q)) {
        alert('올바른 전화번호를 입력해주세요.');
        return;
      }

      try {
        const response = await GroupAPI.getInvitee(groupid, q);
        setSelectedInvUser(response);
        setIsInvModalOpen(true);
        setIsMemberInv(response.isMember);
        setIsPendingInv(response.isPending);
      } catch (err) {
        const errorData = err.response?.error || err;
        alert(`${errorData.message || errorData}`);
      }
    },
    [searchTerm, groupid, isValidPhone]
  );

  //유저 클릭 핸들러
  const handleUserClick = useCallback(
    (userData, isMemberParam, isPendingParam) => {
      setSelectedUser(userData);
      setIsModalOpen(true);
      setIsMember(isMemberParam);
      setIsPending(isPendingParam);
    },
    []
  );

  //키다운 핸들러
  const handleKeyDown = useCallback(
    (e, user) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleUserClick(user);
      }
    },
    [handleUserClick]
  );

  //모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setIsMember(false);
    setIsPending(false);
  }, []);

  const handleCloseInvModal = useCallback(() => {
    setIsInvModalOpen(false);
    setSelectedInvUser(null);
    setIsMemberInv(false);
    setIsPendingInv(false);
  }, []);

  // 검색바 onChange 핸들러
  const handleSearchTermChange = useCallback(value => {
    setSearchTerm(value);
  }, []);

  //유저 초대 함수

  const handleInvite = async (groupId, tel) => {
    try {
      if (!tel) {
        throw new Error('전화번호가 없으면 초대할 수 없어요!');
      }
      await GroupAPI.inviteMember(groupId, tel);
    } catch (response) {
      console.log(
        `초대 중 오류 발생: ${
          error.response?.error || error.message || 'Unknown error'
        }`
      );
      throw error;
    } finally {
      triggerRefresh();
    }
  };

  // 멤버 리스트 렌더링
  const memberList = useMemo(
    () => (
      <div className="space-y-2 p-2 flex flex-col gap-1">
        {/* 그룹 리더 */}
        {members.groupLeader && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleUserClick(members.groupLeader, true, false)}
            onKeyDown={e => handleKeyDown(e, members.groupLeader)}
            className="cursor-pointer rounded-lg transition-colors"
          >
            <Member
              userName={members.groupLeader.userName}
              userRole="개설자"
              type="LEADER"
            />
          </div>
        )}
        {/* 멤버들 */}
        {members.members &&
          members.members.map(member => (
            <div
              key={member.userPk}
              role="button"
              tabIndex={0}
              onClick={() => handleUserClick(member, true, false)}
              onKeyDown={e => handleKeyDown(e, member)}
              className="cursor-pointer rounded-lg transition-colors"
            >
              <Member
                key={member.userPk}
                userName={member.userName}
                userRole="멤버"
                type="MEMBER"
              />
            </div>
          ))}
        {/* 대기자 */}
        {members.waitingList &&
          members.waitingList.map(waiting => (
            <div
              key={waiting.userPk}
              role="button"
              tabIndex={0}
              onClick={() => handleUserClick(waiting, false, true)}
              onKeyDown={e => handleKeyDown(e, waiting)}
              className="cursor-pointer rounded-lg transition-colors"
            >
              <Member
                key={waiting.userPk}
                userName={waiting.userName}
                userRole="수락 대기중"
                showIcon={true}
                icon={BiSolidBellRing}
                type="PENDING"
              />
            </div>
          ))}
      </div>
    ),
    [members, handleUserClick, handleKeyDown]
  );

  const GroupMainContent = useMemo(
    () => (
      <div className="grid grid-rows-[auto,1fr] h-[calc(100dvh-18rem)] min-h-0 bg-white">
        {/* 초대 검색바 */}
        <div className="row-start-1 row-end-2 sticky top-0 z-10 bg-white">
          <SearchBar
            searchTerm={searchTerm}
            onChange={handleSearchTermChange}
            onClick={handleSearch}
            placeholder="전화번호를 검색하세요"
            icon={RiSendPlaneFill}
          />
        </div>
        {/* 멤버 리스트 */}
        <div
          className="row-start-2 row-end-3 min-h-0 overflow-y-auto overscroll-y-contain pb-20"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {memberList}
        </div>
        {/*프로필 모달*/}
        <ProfileModal
          groupId={groupid}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userData={selectedUser}
          showInvitation={false}
          isMember={isMember}
          isPending={isPending}
        />
        {/* 초대 모달 */}
        <ProfileModal
          groupId={groupid}
          isOpen={isInvModalOpen}
          onClose={handleCloseInvModal}
          userData={selectedInvUser}
          showInvitation={true}
          isMember={isMemberInv}
          isPending={isPendingInv}
          onInvite={handleInvite}
        />
      </div>
    ),
    [
      searchTerm,
      handleSearchTermChange,
      handleSearch,
      memberList,
      isModalOpen,
      handleCloseModal,
      selectedUser,
      isMember,
      isPending,
      isInvModalOpen,
      handleCloseInvModal,
      selectedInvUser,
      isMemberInv,
      isPendingInv,
    ]
  );

  // 현재 경로가 /group/:groupid 인지 확인
  const isGroupMain = location.pathname === `/group/${groupid}/main`;

  if (isLoading) {
    return <Loading />;
  }

  return <>{isGroupMain ? GroupMainContent : <Outlet />}</>;
};

export default Group;
