# Show SplashScreen only in PWA standalone mode on mobile

## Problem
The `SplashScreen` component displays for ALL users (browser + PWA) with a 600ms fade. It should only appear when the website is loaded as an installed PWA on a mobile device.

## Plan
- [x] Add mobile user agent detection to `SplashScreen.tsx`
- [x] Add standalone PWA mode detection (matchMedia, navigator.standalone, android-app referrer)
- [x] Skip splash (set mounted=true immediately) when not mobile+standalone
- [x] Keep existing fade behavior for PWA users
- [x] Verify build passes

## Review

### Files Modified (1)
- `components/SplashScreen.tsx` — Added mobile+standalone detection in the existing `useEffect`. If the user is NOT on a mobile device in PWA standalone mode, the splash is skipped entirely by immediately setting `mounted=true`. PWA users on mobile still get the 600ms branded splash fade. Detection logic matches the pattern used in `PWALoadScreen.enhanced.tsx`.

### Summary
Simple conditional guard added to the splash screen component. No other files changed. Browser users no longer see the splash delay. PWA users on mobile retain the branded loading experience.
