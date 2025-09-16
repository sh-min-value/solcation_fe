import apiClient from './api';

export const GroupAPI = {
  getGroup: groupId => apiClient.get(`/group/${groupId}/get`),
  getGroupList: (searchTerm = '') => {
    const params = searchTerm
      ? `?searchTerm=${encodeURIComponent(searchTerm)}`
      : '';
    return apiClient.get(`/group/list${params}`);
  },
  getGroupMembers: groupId => apiClient.get(`/group/${groupId}/members`),
  getInvitee: (groupId, tel) =>
    apiClient.get(
      `/group/${groupId}/get-invitee?tel=${encodeURIComponent(tel)}`
    ),
  inviteMember: (groupId, tel) =>
    apiClient.post(`/group/${groupId}/invite?tel=${tel}`),
  createGroup: data => {
    const formData = new FormData();
    formData.append('gcPk', data.gcPk);
    formData.append('groupName', data.groupName);
    formData.append('profileImg', data.profileImg);

    return apiClient.postMultipart(`/group/new`, formData);
  },
};
