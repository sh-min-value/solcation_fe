import React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AlarmAPI } from '../../services/AlarmAPI';
import { useNavigate, useLocation } from 'react-router-dom';
import { getGroupProfileImage } from '../../services/s3';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { ChevronDown } from 'lucide-react';
import Loading from '../../components/common/Loading';
import NotificationItem from './NotificationItem';

dayjs.extend(relativeTime);
dayjs.locale('ko');

//알림 로딩용 스켈레톤 컴포넌트
const NotificationSkeleton = () => (
  <div className="w-full flex items-center p-3 bg-white rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)]">
    <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0 animate-pulse"></div>
    <div className="w-full flex flex-row items-center justify-between gap-2">
      <div className="ml-4 flex-1 min-w-0">
        <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>
      <div className="ml-3 w-12 h-3 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
    </div>
  </div>
);

//초대 알림용 스켈레톤 컴포넌트
const InviteNotificationSkeleton = () => (
  <div className="w-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl animate-pulse">
    <div className="flex items-center gap-4 p-3">
      <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded mb-1 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="border-t border-gray-5 mt-1"></div>
    <div className="flex">
      <div className="flex-1 py-3 bg-gray-100 border-r border-gray-5"></div>
      <div className="flex-1 py-3 bg-gray-100"></div>
    </div>
  </div>
);

//초대 알림
const InviNotificationItem = React.memo(
  ({ notification, onAccept, onReject, actionLoading, setActionLoading }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    // S3에서 이미지 로드
    useEffect(() => {
      const loadImage = async () => {
        if (!notification.groupImage) return;

        setImageLoading(true);
        try {
          const url = await getGroupProfileImage(notification.groupImage);
          setImageUrl(url);
        } catch (error) {
          console.error('이미지 로드 실패:', error);
          setImageUrl(null);
        } finally {
          setImageLoading(false);
        }
      };

      loadImage();
    }, [notification.groupImage]);

    //수락/거절 핸들러
    const handleAccept = useCallback(async () => {
      setActionLoading(true);
      try {
        await onAccept();
      } catch (err) {
        console.log('초대 수락 실패: ', err);
      } finally {
        setActionLoading(false);
      }
    }, [onAccept]);

    const handleReject = useCallback(async () => {
      setActionLoading(true);
      try {
        await onReject();
      } catch (err) {
        console.log('초대 거절 실패: ', err);
      } finally {
        setActionLoading(false);
      }
    }, [onReject]);

    return (
      <div className="cursor-pointer w-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl">
        <div className="flex items-center gap-4 p-3 relative">
          {/* 그룹 이미지 */}
          <div className="w-16 h-16 flex-shrink-0">
            {imageLoading ? (
              <div className="w-16 h-16 bg-gray-600 rounded-xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={notification.groupName}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {notification.groupName?.charAt(0) || 'G'}
                </span>
              </div>
            )}
          </div>

          {/* 내용 영역 */}
          <div className="flex-1 min-w-">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500 truncate flex-1">
                {notification.groupName}
              </span>
              <span className="text-sm text-gray-400">
                {notification.pnTime
                  ? dayjs(notification.pnTime).fromNow()
                  : notification.time}
              </span>
            </div>

            <h3 className="text-md font-bold text-gray-900">
              {notification.content}
            </h3>

            {notification.content && (
              <p className="text-sm text-gray-600">그룹에 참여하시겠어요?</p>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-5 mt-1"></div>

        {/* 버튼 영역 */}
        <div className="flex">
          <button
            onClick={handleReject}
            disabled={actionLoading}
            className="flex-1 py-2 text-center text-gray-1 font-medium hover:bg-gray-6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-r border-gray-5"
          >
            {actionLoading ? '처리 중...' : '거절'}
          </button>
          <button
            onClick={handleAccept}
            disabled={actionLoading}
            className="flex-1 py-2 text-center text-gray-1 font-medium hover:bg-gray-6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {actionLoading ? '처리 중...' : '수락'}
          </button>
        </div>
      </div>
    );
  }
);

//더보기 버튼
const LoadMoreButton = React.memo(
  ({ onClick, loading: buttonLoading, text = '최근 알림 더보기' }) => {
    return (
      <div className="p-4 text-center">
        <button
          onClick={onClick}
          disabled={buttonLoading}
          className="w-full flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 py-2"
        >
          <span>{buttonLoading ? '로딩 중...' : text}</span>
          {!buttonLoading && <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    );
  }
);

const Alarm = ({ triggerRefresh }) => {
  const navigate = useNavigate();
  const location = useLocation();

  //초대 알림 정보
  const [inviteNoti, setInviteNoti] = useState([]);

  //최근 7일 알림 정보
  const [recent7DaysNoti, setRecent7DaysNoti] = useState([]);
  const [recent7DaysPage, setRecent7DaysPage] = useState(0);
  //최근 30일 알림 정보
  const [recent30DaysNoti, setRecent30DaysNoti] = useState([]);
  const [recent30DaysPage, setRecent30DaysPage] = useState(0);

  //로딩 상태
  const [loading, setLoading] = useState({
    invite: false,
    recent7Days: false,
    recent30Days: false,
  });
  const [actionLoading, setActionLoading] = useState(false);
  //초기 로딩 상태 추가
  const [initialLoading, setInitialLoading] = useState(true);

  //페이지네이션
  const [hasNext, setHasNext] = useState({
    recent7Days: false,
    recent30Days: false,
  });

  //한 페이지 당 개수
  const itmesPerPage = 3;

  const handleAcceptInvite = useCallback(async (pnPk, groupPk) => {
    console.log('수락 요청 - pnPk:', pnPk, 'groupPk:', groupPk);
    const param = {
      pnPk: pnPk,
      groupPk: groupPk,
      decision: true,
    };

    console.log('전송할 데이터:', param);

    try {
      const result = await AlarmAPI.updateInvite(param);
      console.log('수락 결과:', result);

      setInviteNoti(prev =>
        prev.filter(notification => notification.pnPk !== pnPk)
      );
    } catch (err) {
      console.error('초대 수락 실패:', err);
      console.error('에러 응답:', err.response);
    }
  }, []);

  const handleRejectInvite = useCallback(async (pnPk, groupPk) => {
    console.log('거절 요청 - pnPk:', pnPk, 'groupPk:', groupPk);
    const param = {
      pnPk: pnPk,
      groupPk: groupPk,
      decision: false,
    };

    console.log('전송할 데이터:', param);

    try {
      const result = await AlarmAPI.updateInvite(param);
      console.log('거절 결과:', result);

      setInviteNoti(prev =>
        prev.filter(notification => notification.pnPk !== pnPk)
      );
    } catch (err) {
      console.error('초대 거절 실패:', err);
      console.error('에러 응답:', err.response);
    }
  }, []);

  const fetchInviteNoti = useCallback(async () => {
    setLoading(prev => ({ ...prev, invite: true }));
    try {
      const result = await AlarmAPI.getInvitationList();
      console.log('초대 알림 목록:', result);
      setInviteNoti(result || []);
    } catch (err) {
      const errorData = err.response?.error || err;

      //에러 발생 시 에러 페이지로 이동
      navigate('/error', {
        state: {
          error: errorData,
          from: location.pathname,
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, invite: false }));
    }
  }, [navigate, location.pathname]);

  const fetchRecent7DaysNoti = useCallback(
    async (page = 0) => {
      setLoading(prev => ({ ...prev, recent7Days: true }));
      try {
        const result = await AlarmAPI.getRecent7DaysList(page, itmesPerPage);
        const data = result.content || [];
        setHasNext(prev => ({ ...prev, recent7Days: result.hasNext }));

        if (data.length === 0) {
          return;
        }

        if (page === 0) {
          setRecent7DaysNoti(data);
        } else {
          setRecent7DaysNoti(prev => [...prev, ...data]);
        }
      } catch (err) {
        const errorData = err.response?.error || err;

        //에러 발생 시 에러 페이지로 이동
        navigate('/error', {
          state: {
            error: errorData,
            from: location.pathname,
          },
        });
      } finally {
        setLoading(prev => ({ ...prev, recent7Days: false }));
      }
    },
    [navigate, location.pathname]
  );

  const fetchRecent30DaysNoti = useCallback(
    async (page = 0) => {
      setLoading(prev => ({ ...prev, recent30Days: true }));
      try {
        const result = await AlarmAPI.getRecent30DaysList(page, itmesPerPage);
        const data = result.content || [];

        setHasNext(prev => ({ ...prev, recent30Days: result.hasNext }));

        if (data.length === 0) {
          return;
        }

        if (page === 0) {
          setRecent30DaysNoti(data);
        } else {
          setRecent30DaysNoti(prev => [...prev, ...data]);
        }
      } catch (err) {
        const errorData = err.response?.error || err;

        //에러 발생 시 에러 페이지로 이동
        navigate('/error', {
          state: {
            error: errorData,
            from: location.pathname,
          },
        });
      } finally {
        setLoading(prev => ({ ...prev, recent30Days: false }));
      }
    },
    [navigate, location.pathname]
  );

  const handleLoadMore7Days = useCallback(() => {
    const nextPage = recent7DaysPage + 1;
    setRecent7DaysPage(nextPage);
    fetchRecent7DaysNoti(nextPage);
  }, [recent7DaysPage, fetchRecent7DaysNoti]);

  const handleLoadMore30Days = useCallback(() => {
    const nextPage = recent30DaysPage + 1;
    setRecent30DaysPage(nextPage);
    fetchRecent30DaysNoti(nextPage);
  }, [recent30DaysPage, fetchRecent30DaysNoti]);

  //페이지 로드 시 초기 데이터 세팅
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchInviteNoti(),
          fetchRecent7DaysNoti(0),
          fetchRecent30DaysNoti(0),
        ]);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, [fetchInviteNoti, fetchRecent7DaysNoti, fetchRecent30DaysNoti]);
  useEffect(() => {
    if (location.state?.reload) {
      // 데이터 새로고침
      fetchInviteNoti();
      fetchRecent7DaysNoti(0);
      fetchRecent30DaysNoti(0);

      // state를 초기화해서 무한 루프 방지
      navigate(location.pathname, { replace: true, state: {} });
    }
    // location.state?.reload만 의존성에 추가
  }, [location.state?.reload]);
  const isEmpty = React.useMemo(() => {
    return (
      inviteNoti.length === 0 &&
      recent7DaysNoti.length === 0 &&
      recent30DaysNoti.length === 0
    );
  }, [inviteNoti.length, recent7DaysNoti.length, recent30DaysNoti.length]);

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center h-full justify-start">
        {/* 그룹 초대 스켈레톤 */}
        <div className="w-full flex flex-col mb-4">
          <div className="w-full text-gray-2 text-xl font-md text-left p-2">
            그룹 초대
          </div>
          <div className="w-full bg-white flex flex-col items-center justify-start gap-3">
            <InviteNotificationSkeleton />
            <InviteNotificationSkeleton />
          </div>
        </div>

        {/* 최근 7일 스켈레톤 */}
        <div className="w-full flex flex-col mb-4">
          <div className="w-full text-gray-2 text-xl font-md text-left p-2">
            최근 7일
          </div>
          <div className="w-full bg-white flex flex-col items-center justify-start gap-3">
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        </div>

        {/* 최근 30일 스켈레톤 */}
        <div className="w-full flex flex-col mb-4">
          <div className="w-full text-gray-2 text-xl font-md text-left p-2">
            최근 30일
          </div>
          <div className="w-full bg-white flex flex-col items-center justify-start gap-3">
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {actionLoading ? (
        <Loading size="large" color="gray" />
      ) : (
        <div
          className={`flex flex-col items-center min-h-full relative ${
            isEmpty ? 'justify-center' : 'justify-start'
          }`}
        >
          {/* 그룹 초대 */}
          {inviteNoti.length > 0 && (
            <div className="w-full flex flex-col mb-4">
              <div className="w-full text-gray-2 text-xl font-md text-left p-2">
                그룹 초대
              </div>
              <div className="w-full bg-white flex flex-col items-center justify-start gap-3">
                {/*초대 목록 */}
                {inviteNoti.map(noti => (
                  <InviNotificationItem
                    key={noti.pnPk}
                    notification={noti}
                    onAccept={() => handleAcceptInvite(noti.pnPk, noti.groupPk)}
                    onReject={() => handleRejectInvite(noti.pnPk, noti.groupPk)}
                    actionLoading={actionLoading}
                    setActionLoading={setActionLoading}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 최근 7일 */}
          {recent7DaysNoti.length > 0 && (
            <div className=" w-full flex flex-col mb-4">
              <div className="w-full text-gray-2 text-xl font-md text-left p-2">
                최근 7일
              </div>
              <div className="w-full h-full bg-white flex flex-col items-center justify-start gap-3">
                {recent7DaysNoti.map(noti => (
                  <NotificationItem key={noti.pnPk} notification={noti} />
                ))}
                {loading.recent7Days && (
                  <>
                    <NotificationSkeleton />
                    <NotificationSkeleton />
                    <NotificationSkeleton />
                  </>
                )}
              </div>
              {hasNext.recent7Days && !loading.recent7Days && (
                <LoadMoreButton
                  onClick={handleLoadMore7Days}
                  loading={loading.recent7Days}
                />
              )}
            </div>
          )}

          {/* 최근 30일 */}
          {recent30DaysNoti.length > 0 && (
            <div className="w-full flex flex-col mb-4">
              <div className="w-full text-gray-2 text-xl font-md text-left p-2">
                최근 30일
              </div>
              <div className="w-full bg-white flex flex-col items-center justify-start gap-3">
                {recent30DaysNoti.map(noti => (
                  <NotificationItem key={noti.pnPk} notification={noti} />
                ))}
                {loading.recent30Days && (
                  <>
                    <NotificationSkeleton />
                    <NotificationSkeleton />
                    <NotificationSkeleton />
                  </>
                )}
              </div>
              {hasNext.recent30Days && !loading.recent30Days && (
                <LoadMoreButton
                  onClick={handleLoadMore30Days}
                  loading={loading.recent30Days}
                />
              )}
            </div>
          )}

          {/* 알림이 아무것도 없는 경우 */}
          {isEmpty && (
            <div className="text-gray-2 text-md font-md">
              알림이 존재하지 않습니다.
            </div>
          )}
        </div>
      )}
    </>
  );
};

NotificationItem.displayName = 'NotificationItem';
InviNotificationItem.displayName = 'InviNotificationItem';
LoadMoreButton.displayName = 'LoadMoreButton';
export default Alarm;
