module.exports = {
  id: '66c5ae6b-7b9c-44c1-9058-ffc82c0a3260',
  version: '1.0',
  elements: {
    eventDispatchers: [
      {
        id: 'eventDispatcher_1',
        type: 'END',
      },
    ],
    eventListeners: [
      {
        id: 'eventListener_3',
        interrupting: true,
        phaseId: null,
        type: 'START',
      },
      {
        id: 'eventListener_4',
        durationInMS: 10000,
        phaseId: 'phase_1',
        interrupting: true,
        type: 'TIMER',
      },
    ],
    flows: [
      {
        id: 'flow_1',
        srcId: 'eventListener_3',
        destId: 'phase_1',
      },
      {
        id: 'flow_2',
        srcId: 'eventListener_4',
        destId: 'eventDispatcher_1',
      },
    ],
    gateways: [],
    phases: [
      {
        id: 'phase_1',
        commands: [],
      },
    ],
  },
}
