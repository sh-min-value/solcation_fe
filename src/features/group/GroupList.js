import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import GroupCard from '../../components/common/GroupCard';
import { useNavigate } from 'react-router-dom';
import { groupAPI } from '../../services/api';
import { BiSearch } from 'react-icons/bi';

const GroupList = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // 그룹 목록 불러오기
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await groupAPI.getGroupList(searchTerm);
        setGroups(response.data || response);
        console.log(response);
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
    navigate(`/group/${groupPk}`);
  };

  // 검색 핸들러
  const handleSearch = e => {
    e.preventDefault();
    // searchTerm이 변경되면 useEffect가 자동으로 실행됨
  };

  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton={true} showHomeButton={true} />
      <div className="bg-main m-0">
        <div className="p-6 rounded-t-3xl bg-white">
          {/* 검색 바 */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="그룹 이름을 검색해주세요"
                className="w-full px-4 py-2 pr-12 rounded-3xl border-2 border-main focus:outline-none focus:ring-2 focus:ring-main/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <BiSearch className="w-6 h-6 text-main" />
              </button>
            </form>
          </div>

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
            <div className="space-y-4">
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
      </div>
    </div>
  );
};

export default GroupList;
