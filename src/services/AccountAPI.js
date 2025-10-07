import apiClient from './api';

export const AccountAPI = {
  // 그룹 계좌 생성
  createAccount: (groupId, accountData) => {
    const formData = new FormData();

    formData.append('groupPk', accountData.groupPk);
    formData.append('saPw', accountData.saPw);
    formData.append('signature', accountData.signature);

    return apiClient.postMultipart(`/group/${groupId}/account/new`, formData);
  },

  // 모임통장 정보 조회
  getAccountInfo: groupId => apiClient.get(`/group/${groupId}/account/info`),

  // 전체 거래 내역 조회 (필터링 포함)
  getTransactionHistory: groupId =>
    apiClient.get(`/group/${groupId}/account/transaction/all`),

  // 모임통장 정기 입금일 설정
  setRegularDeposit: (groupId, depositData) =>
    apiClient.post(`/group/${groupId}/account/cycle`, depositData),

  //정기 입금일 비활성화
  resetRegularDeposit: (groupId, saPk) =>
    apiClient.post(`/group/${groupId}/account/reset-cycle/${saPk}`),

  verifyPassword: (groupId, saPk, data) =>
    apiClient.post(`/group/${groupId}/account/${saPk}/sa-login`, data),
  
};
