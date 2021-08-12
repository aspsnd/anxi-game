const { isMobile: isMobileFunc } = ZY;
export const autoLogin = location.search.length > 3 ? ['tester1', '123456'] : ['tester2', '123456'];
// export const autoLoginTarget = 0;
export const autoLoginTarget = undefined;
export const openDropMonst = true;
export const dynamicResource = true;
export const exposeToWindow = true;
export const closeAllBg = !!1;
export const openPtoCtrlRun = !!1;
export const autoEnterCard = 0;
export const autoEnterCardIndex = 0;
export const isMobile = isMobileFunc() || 0;
export const forbidFullScreenFunc = true;
export const useLocalServer = false;
export const netBaseUrl = useLocalServer ? 'http://localhost:10003/' : 'http://139.224.8.192/server10003/';

/**
 * for build
 */
// export const autoLogin = false;
// export const autoLoginTarget = undefined;
// export const openDropMonst = false;
// export const dynamicResource = false;
// export const exposeToWindow = false;
// export const closeAllBg = !!0;
// export const openPtoCtrlRun = !!0;
// export const autoEnterCard = false;
// export const autoEnterCardIndex = 3;
// export const useLocalServer = false;
// export const netBaseUrl = useLocalServer ? 'http://localhost:10003/' : 'http://139.224.8.192/server10003/';