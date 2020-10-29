export type EventName = 'wantleft' | 'wantright' | 'wantattack' | 'wantjump' | 'wantdrop' | 'wantskill' | 'wantura' |
    'cancelleft' | 'cancelright' | `stating_$` | `loststate_$` | `getstate_$` | 'createAttack' | 'setAffect'
    | 'getAffect' | 'resAffect' | 'beAffect' | 'nhpchange' | 'nmpchange' | 'die' | 'wantgo' | `timer_$` | 'timing' | 'addlevel' | 'framing'
    | 'finishcard' | 'getura' | 'lostura' | 'urafull' | 'getmoney' | 'getexp' | 'reduceexp' | 'reducemoney' | 'wantdown' | 'statechange'
    | 'holdvita_0' | 'holdvita_1' | 'holdvita_2' | 'behold_0' | 'behold_1' | 'behold_2' | 'cancelskill' | 'hittarget' | 'bedod' | 'timeratechange'
    | 'beinterrupt' | 'clear' | 'reallydie' | 'movex' | 'movey' | 'killenemy' | 'getura' | 'lostura' | 'wantdie' | 'getaffectpre' | 'overlevel'
    | 'reduceexp' | 'overexp'
export type EventComt = {
    handler: Function,
    type: EventName | undefined,
    index: number,
    checker: Function | undefined
}