import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import WelcomeScreen from '../common/WelcomeScreen';

const LoginForm = () => {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    const result = await login({
      userId,
      userPw,
    });

    if (result.success) {
      setShowWelcome(true);
    }

    setIsLoading(false);
  };
  const handleWelcomeFinish = () => {
    navigate('/main'); // 홈으로 이동
  };

  if (showWelcome) {
    return <WelcomeScreen onFinish={handleWelcomeFinish} />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-main via-main via-20% to-secondary flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="max-w-md w-full p-8">
          <h1 className="text-lg font-bold text-white mb-8 text-center">
            Login
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 mb-12">
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-white mb-1"
                >
                  아이디
                </label>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border-b-2 border-light-blue focus:outline-none text-white text-lg font-bold"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="userPw"
                  className="block text-sm font-medium text-white mb-1"
                >
                  비밀번호
                </label>
                <input
                  id="userPw"
                  type="password"
                  value={userPw}
                  onChange={e => setUserPw(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border-b-2 border-light-blue focus:outline-none text-white text-lg font-bold"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-xs text-end">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-third text-white py-2 rounded-sm hover:bg-main/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          <div
            className="mt-2 text-sm text-center underline text-third cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/signup')}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
              }
            }}
          >
            아직 회원이 아니신가요?
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
