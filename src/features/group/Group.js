import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import { groupAPI } from '../../services/groupAPI';
import SearchBar from './SearchBar';
import { RiSendPlaneFill } from 'react-icons/ri';
import Member from './Member';
import { BiSolidBellRing } from 'react-icons/bi';
import ProfileModal from './ProfileModal';

const Group = () => {
  const location = useLocation();
  const { groupid } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  //그룹 정보
  const [groupData, setGroupData] = useState(null);

  //멤버 목록
  const [members, setMembers] = useState({
    groupLeader: null,
    members: [],
    waitingList: [],
  });
  const [searchTerm, setSearchTerm] = useState(''); //전화번호 검색

  //모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 그룹 유효성 검사
  useEffect(() => {
    const validateGroup = async () => {
      try {
        setLoading(true);
        setError(null);

        // 그룹 기본 정보 로드
        const groupInfo = await groupAPI.getGroup(groupid);
        console.log('그룹 데이터:', groupInfo);
        setGroupData(groupInfo);

        // 그룹 멤버 정보 로드
        const memberInfo = await groupAPI.getGroupMembers(groupid);
        console.log('그룹 멤버 데이터:', memberInfo);

        // 멤버 데이터 설정
        setMembers({
          groupLeader: memberInfo.groupLeader || null,
          members: memberInfo.members || [],
          waitingList: memberInfo.waitingList || [],
        });

        setGroupData(groupInfo);
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

  // 검색 핸들러
  const handleSearch = e => {
    e.preventDefault();
    // searchTerm이 변경되면 useEffect가 자동으로 실행됨
  };

  //유저 클릭 핸들러
  const handleUserClick = userData => {
    setSelectedUser(userData);
    setIsModalOpen(true);
  };

  //키다운 핸들러
  const handleKeyDown = (e, user) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleUserClick(user);
    }
  };

  //모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const GroupMainContent = () => (
    <div className="h-full flex flex-col bg-white">
      {/* 초대 검색바 */}
      <div className="sticky top-0 z-10 bg-white">
        <SearchBar
          searchTerm={searchTerm}
          onChange={setSearchTerm}
          onSubmit={handleSearch}
          placeholder="전화번호를 검색하세요"
          icon={RiSendPlaneFill}
        />
      </div>
      {/* 멤버 리스트 */}
      <div className="flex-1 overflow-y-scroll">
        <div className="space-y-3 p-3 pb-20 flex flex-col gap-1">
          {/* 그룹 리더 */}
          {members.groupLeader && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleUserClick(members.groupLeader)}
              onKeyDown={e => handleKeyDown(e, members.groupLeader)}
              className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Member
                userName={members.groupLeader.userName}
                userRole="개설자"
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
                onClick={() => handleUserClick(member)}
                onKeyDown={e => handleKeyDown(e, member)}
                className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Member
                  key={member.userPk}
                  userName={member.userName}
                  userRole="멤버"
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
                onClick={() => handleUserClick(waiting)}
                onKeyDown={e => handleKeyDown(e, waiting)}
                className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Member
                  key={waiting.userPk}
                  userName={waiting.userName}
                  userRole="수락 대기중"
                  showIcon={true}
                  icon={BiSolidBellRing}
                />
              </div>
            ))}
        </div>
      </div>
      {/*프로필 모달*/}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userData={selectedUser}
      />
    </div>
  );

  // 현재 경로가 /group/:groupid 인지 확인
  const isGroupMain = location.pathname === `/group/${groupid}`;

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  return <>{isGroupMain ? <GroupMainContent /> : <Outlet />}</>;
};

export default Group;
