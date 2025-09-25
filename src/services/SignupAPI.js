import apiClient from './api';

// 회원가입 API 클라이언트 (인증 불필요)
class signupAPI {
  //아이디 중복 체크
  async checkDup(id) {
    return apiClient.get(`/auth/check-dup?userId=${id}`);
  }

  //회원가입
  async signUp(data) {
    return apiClient.post('/auth/sign-up', data);
  }
}

// CategoryAPI 인스턴스
const SignupAPI = new signupAPI();

export default SignupAPI;
