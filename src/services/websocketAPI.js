// WebSocket API 관련 함수들 (백엔드 CRDT 구조에 맞춤)
export const websocketAPI = {
  // 편집 세션 입장
  joinEditSession: (publish, groupId, travelId, userId) => {
    if (!publish) return;
    
    publish({
      destination: `/app/group/${groupId}/travel/${travelId}/edit/join`,
      body: JSON.stringify({
        userId: userId
      })
    });
  },

  // 편집 세션 퇴장
  leaveEditSession: (publish, groupId, travelId, userId) => {
    if (!publish) return;
    
    publish({
      destination: `/app/group/${groupId}/travel/${travelId}/edit/leave`,
      body: JSON.stringify({
        userId: userId
      })
    });
  },

  // 저장 완료 알림
  publishSaveCompleted: (publish, groupId, travelId, clientId) => {
    if (!publish) return;
    
    publish({
      destination: `/app/group/${groupId}/travel/${travelId}/edit/save`,
      body: JSON.stringify({
        clientId: clientId
      })
    });
  },

  // CRDT 작업 전송 (insert, move, moveDay, update, delete)
  publishCrdtOperation: (publish, groupId, travelId, operation) => {
    if (!publish) return;
    
    publish({
      destination: `/app/group/${groupId}/travel/${travelId}/edit/op`,
      body: JSON.stringify(operation)
    });
  },

  // 일정 삽입 작업
  publishInsertOperation: (publish, groupId, travelId, clientId, day, planData, prevCrdtId = null, nextCrdtId = null) => {
    if (!publish) return;
    
    const operation = {
      type: 'insert',
      opId: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      clientId: clientId,
      opTs: Date.now(),
      day: day,
      payload: {
        pdDay: day,
        pdPlace: planData.pdPlace,
        pdAddress: planData.pdAddress,
        pdCost: planData.pdCost,
        prevCrdtId: prevCrdtId,
        nextCrdtId: nextCrdtId
      }
    };
    
    websocketAPI.publishCrdtOperation(publish, groupId, travelId, operation);
  },

  // 일정 이동 작업 (같은 날 내에서)
  publishMoveOperation: (publish, groupId, travelId, clientId, day, crdtId, prevCrdtId, nextCrdtId) => {
    if (!publish) return;
    
    const operation = {
      type: 'move',
      opId: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      clientId: clientId,
      opTs: Date.now(),
      day: day,
      payload: {
        crdtId: crdtId,
        prevCrdtId: prevCrdtId,
        nextCrdtId: nextCrdtId
      }
    };
    
    websocketAPI.publishCrdtOperation(publish, groupId, travelId, operation);
  },

  // 일정 날짜 이동 작업
  publishMoveDayOperation: (publish, groupId, travelId, clientId, oldDay, newDay, crdtId, prevCrdtId, nextCrdtId) => {
    if (!publish) return;
    
    const operation = {
      type: 'moveDay',
      opId: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      clientId: clientId,
      opTs: Date.now(),
      day: oldDay,
      payload: {
        crdtId: crdtId,
        prevCrdtId: prevCrdtId,
        nextCrdtId: nextCrdtId,
        newDay: newDay
      }
    };
    
    websocketAPI.publishCrdtOperation(publish, groupId, travelId, operation);
  },

  // 일정 수정 작업
  publishUpdateOperation: (publish, groupId, travelId, clientId, day, crdtId, updateData) => {
    if (!publish) return;
    
    const operation = {
      type: 'update',
      opId: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      clientId: clientId,
      opTs: Date.now(),
      day: day,
      payload: {
        crdtId: crdtId,
        ...updateData
      }
    };
    
    websocketAPI.publishCrdtOperation(publish, groupId, travelId, operation);
  },

  // 일정 삭제 작업
  publishDeleteOperation: (publish, groupId, travelId, clientId, day, crdtId) => {
    if (!publish) return;
    
    const operation = {
      type: 'delete',
      opId: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      clientId: clientId,
      opTs: Date.now(),
      day: day,
      payload: {
        crdtId: crdtId
      }
    };
    
    websocketAPI.publishCrdtOperation(publish, groupId, travelId, operation);
  }
};

export default websocketAPI;
