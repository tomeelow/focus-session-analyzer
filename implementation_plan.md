# Implementation Plan - Email Verification Flow

## Goal Description
Implement a simulated email verification flow for Mindtrack's localStorage authentication. Users must verify their email with a generated code before logging in.

## User Review Required
> [!NOTE]
> This is a simulated flow. Verification codes will be displayed on the screen for testing purposes since there is no backend email service.

## Proposed Changes

### Data Model & Storage
#### [MODIFY] [storage.js](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/services/storage.js)
- Update `StoredUser` schema to include `isVerified`, `verificationCode`, `verificationCodeCreatedAt`.
- Add `PENDING_VERIFICATION_USER_ID_KEY`.
- Implement `generateVerificationCode` (6-digit).
- Update `saveUser` to handle verification fields and default `isVerified: true` for existing users.

### UI Components
#### [NEW] [VerifyEmailScreen.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/VerifyEmailScreen.jsx)
- Display email being verified.
- Input for 6-digit code.
- "Verify" and "Resend Code" buttons.
- **Display the "simulated" code on screen (Demo Mode).**
- **Implement expiration check (15 minutes).**

#### [MODIFY] [AuthScreen.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/AuthScreen.jsx)
- Update `handleSubmit` for signup:
    - Generate verification code.
    - Save user with `isVerified: false`.
    - Set `pendingVerificationUserId`.
    - Redirect to verification.
- Update `handleSubmit` for login:
    - Check `user.isVerified`.
    - If false, set `pendingVerificationUserId` and redirect to verification.

#### [MODIFY] [App.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/App.jsx)
- Add `isPendingVerification` state.
- Update `checkAuth` to check for `pendingVerificationUserId`.
- Render `VerifyEmailScreen` if `isPendingVerification` is true.
- Handle transitions between Auth, Verification, and Main App.

## Verification Plan
### Manual Verification
- **Signup Flow**: Sign up a new user -> Verify redirected to "Verify Email" -> Enter code -> Verify logged in.
- **Login Blocking**: Sign up -> Close tab -> Open tab -> Try to login -> Verify redirected to "Verify Email".
- **Resend Code**: Click "Resend Code" -> Verify new code displayed.
- **Expiration**: Wait 15 minutes (or simulate by editing localStorage) -> Verify code expired.
- **Existing Users**: Ensure existing users can still login (treated as verified).
