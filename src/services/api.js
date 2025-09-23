// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// HTTP 클라이언트 클래스
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // 기본 요청 메서드
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // FormData인 경우 Content-Type을 설정하지 않음 (브라우저가 자동으로 설정)
    const isFormData = options.body instanceof FormData;
    
    const config = {
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    };

    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('accessToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';
    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      // 에러 응답도 JSON으로 파싱해서 전달
      const errorData = await response.json().catch(() => ({}));
      console.log(response);
      //인증 실패 처리
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.clear();
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
        return;
      }

      // 전체 에러 정보를 포함한 객체 throw
      const error = {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        ...errorData
      };
      throw error;
    }

    const data = await response.json();
    return data;
  }

  // POST 요청
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // Multipart POST 요청 - 파일 업로드용
  async postMultipart(endpoint, formData, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'POST',
      body: formData,
      headers: {},
      ...options,
    };

    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('accessToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `${tokenType} ${token}`,
      };
    }

    try {
      console.log('Sending multipart request to:', url);
      console.log('FormData contents:');
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Multipart API Error:', {
          status: response.status,
          statusText: response.statusText,
          url: url,
          errorData: errorData,
        });

        if (response.status === 401) {
          localStorage.clear();
          alert('로그인이 필요합니다.');
          window.location.href = '/login';
          return;
        }

        const error = new Error(`HTTP error! status: ${response.status}`);
        error.response = errorData;
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Multipart request failed:', error);
      throw error;
    }
  }

  // GET 요청
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  // DELETE 요청
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// API 클라이언트 인스턴스
const apiClient = new ApiClient(API_BASE_URL);

// 인증 관련 API
export const authAPI = {
  login: credentials => apiClient.post('/auth/login', credentials),
};

export default apiClient;
