import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import GroupCard from '../../components/common/GroupCard';
import { useNavigate } from 'react-router-dom';
import { GroupAPI } from '../../services/GroupAPI';
import { BiSearch } from 'react-icons/bi';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';

/* 검색 바 컴포넌트 */
const SearchBar = ({
  searchTerm,
  onChange,
  onSubmit,
  placeholder,
  icon: IconComponent,
  submitOnChange = false,
}) => {
  const handleSubmit = e => {
    const value = e.target.value;
    onChange(value);
    onSubmit?.(e);
  };

  return (
    <div className="mb-5">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={e => onChange(e.target.value)}
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
};

/* 그룹 리스트 */
const GroupList = () => {
  const navigate = useNavigate();

  //그룹 정보
  const [groups, setGroups] = useState([]);

  //검색어
  const [searchTerm, setSearchTerm] = useState('');

  //로딩 및 에러 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 그룹 목록 불러오기
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await GroupAPI.getGroupList(searchTerm);
        setGroups(response.data || response);
      } catch (err) {
        setError(err);
        console.error('그룹 목록 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [searchTerm]);

  // 그룹 클릭 핸들러
  const handleGroupClick = groupPk => {
    navigate(`/group/${groupPk}/main`);
  };

  // 검색 핸들러
  const handleSearch = e => {
    e.preventDefault();
    // searchTerm이 변경되면 useEffect가 자동으로 실행됨
  };

  //새 그룹 생성 핸들러
  const handleCreateGroup = () => {
    navigate('/group/new');
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <Header showBackButton={true} showHomeButton={true} />
      <div className="bg-main flex-1 flex flex-col overflow-hidden">
        <div className="h-full flex-1 flex flex-col p-6 rounded-t-3xl bg-white overflow-hidden">
          {/* 검색 바 */}
          <SearchBar
            searchTerm={searchTerm}
            onChange={setSearchTerm}
            onSubmit={handleSearch}
            placeholder="그룹 이름을 검색하세요"
            icon={BiSearch}
            submitOnChange={true}
          />
          {/* 그룹 목록 */}
          <div className="flex-1 overflow-y-scroll pb-24 pt-1">
            {/* 로딩 상태 */}
            {loading && (
              <div className="text-center py-8">
                <div className="text-white text-lg">
                  그룹 목록을 불러오는 중...
                </div>
              </div>
            )}

            {/* 에러 상태 */}
            {error && (
              <div className="text-center py-8">
                <div className="text-red-400 text-lg">
                  그룹 목록을 불러올 수 없습니다.
                </div>
              </div>
            )}

            {/* 그룹 목록 */}
            {!loading && !error && (
              <div className="space-y-4 flex flex-col gap-1">
                {groups.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-white text-lg">
                      등록된 그룹이 없습니다.
                    </div>
                  </div>
                ) : (
                  groups.map(group => (
                    <GroupCard
                      key={group.groupPk}
                      group={group}
                      onClick={() => handleGroupClick(group.groupPk)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
          {/* 새 그룹 생성 버튼 */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleCreateGroup}
              className="bg-white backdrop-blur-sm rounded-3xl p-3 shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] transition-all duration-200 cursor-pointer transform hover:-translate-y-1 w-full font-bold flex items-center justify-center h-15 gap-3"
            >
              <AiOutlineUsergroupAdd className="w-6 h-6" />
              <span className="text-lg">새 그룹 생성하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupList;
