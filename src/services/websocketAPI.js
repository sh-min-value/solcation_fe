// WebSocket API 관련 함수들 (백엔드 CRDT 구조에 맞춤)
export const WebsocketAPI = {
  // 편집 세션 입장
  joinEditSession: (publish, groupId, travelId, userId) => {
    if (!publish) return;

    publish({
      destination: `/app/group/${groupId}/travel/${travelId}/edit/join`,
      body: JSON.stringify({
        userId: userId,
      }),
    });
  },

  // 편집 세션 퇴장
  leaveEditSession: (publish, groupId, travelId, userId) => {
    if (!publish) return;

    publish({
      destination: `/app/group/${groupId}/travel/${travelId}/edit/leave`,
      body: JSON.stringify({
        userId: userId,
      }),
    });
  },

  // publishSaveCompleted: (publish, groupId, travelId, clientId) => {
  //   if (!publish) return;
  //   publish({
  //     destination: `/app/group/${groupId}/travel/${travelId}/edit/save`,
  //     body: JSON.stringify({ clientId: clientId }),
  //   });
  // },

  // CRDT 작업 전송 (insert, move, moveDay, update, delete)
  publishCrdtOperation: (publish, groupId, travelId, operation) => {
    if (!publish) return;

    console.log('전송할 operation:', operation);
    console.log('opTs 타입:', typeof operation.opTs, '값:', operation.opTs);
    
    const jsonBody = JSON.stringify(operation);
    console.log('JSON.stringify 결과:', jsonBody);

    publish({
      destination: `/app/group/${groupId}/travel/${travelId}/edit/op`,
      body: jsonBody,
    });
  },

  // 일정 삽입 작업
  publishInsertOperation: (
    publish,
    groupId,
    travelId,
    clientId,
    day,
    planData,
    prevCrdtId = null,
    nextCrdtId = null
  ) => {
    if (!publish) return;

    const operation = {
      type: 'insert',
      opId: crypto.randomUUID(),
      clientId: clientId,
      opTs: Date.now(), 
      day: day,
      tcCode: planData.tcCode, 
      payload: {
        pdDay: day,
        pdPlace: planData.pdPlace,
        pdAddress: planData.pdAddress,
        pdCost: planData.pdCost,
        tcCode: planData.tcCode,  
        prevCrdtId: prevCrdtId || '', 
        nextCrdtId: nextCrdtId || '', 
      },
    };

    WebsocketAPI.publishCrdtOperation(publish, groupId, travelId, operation);
  },

  // 일정 이동 작업 (같은 날 내에서)
  publishMoveOperation: (
    publish,
    groupId,
    travelId,
    clientId,
    day,
    crdtId,
    prevCrdtId,
    nextCrdtId,
    tcCode = null
  ) => {
    if (!publish) return;

    const operation = {
      type: 'move',
      opId: crypto.randomUUID(), 
      clientId: clientId,
      opTs: Date.now(), 
      day: day,
      tcCode: tcCode, 
      payload: {
        crdtId: crdtId,
        prevCrdtId: prevCrdtId || '', 
        nextCrdtId: nextCrdtId || '', 
      },
    };

    WebsocketAPI.publishCrdtOperation(publish, groupId, travelId, operation);
  },

  // 일정 날짜 이동 작업
  publishMoveDayOperation: (
    publish,
    groupId,
    travelId,
    clientId,
    oldDay,
    newDay,
    crdtId,
    prevCrdtId,
    nextCrdtId,
    tcCode = null
  ) => {
    if (!publish) return;

    const operation = {
      type: 'moveDay',
      opId: crypto.randomUUID(), 
      clientId: clientId,
      opTs: Date.now(),
      day: oldDay,
      tcCode: tcCode, 
      payload: {
        crdtId: crdtId,
        prevCrdtId: prevCrdtId || '', 
        nextCrdtId: nextCrdtId || '', 
        newDay: newDay,
      },
    };

    WebsocketAPI.publishCrdtOperation(publish, groupId, travelId, operation);
  },

  // 일정 수정 작업
  publishUpdateOperation: (
    publish,
    groupId,
    travelId,
    clientId,
    day,
    crdtId,
    updateData
  ) => {
    if (!publish) return;

    const operation = {
      type: 'update',
      opId: crypto.randomUUID(), 
      clientId: clientId,
      opTs: Date.now(),
      day: day,
      tcCode: updateData.tcCode || null, 
      payload: {
        crdtId: crdtId,
        ...updateData,
      },
    };

    WebsocketAPI.publishCrdtOperation(publish, groupId, travelId, operation);
  },

  // 일정 삭제 작업
  publishDeleteOperation: (
    publish,
    groupId,
    travelId,
    clientId,
    day,
    crdtId,
    tcCode = null
  ) => {
    if (!publish) return;

    const operation = {
      type: 'delete',
      opId: crypto.randomUUID(), 
      clientId: clientId,
      opTs: Date.now(),
      day: day,
      tcCode: tcCode, 
      payload: {
        crdtId: crdtId,
      },
    };

    WebsocketAPI.publishCrdtOperation(publish, groupId, travelId, operation);
  },
};

export default WebsocketAPI;
