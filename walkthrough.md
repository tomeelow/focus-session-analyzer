# Walkthrough - Email Verification Flow

I have implemented a simulated email verification flow for Mindtrack. This ensures that new users must verify their email address before accessing the application.

## Changes
- **Updated User Model**: Added `isVerified`, `verificationCode`, and `verificationCodeCreatedAt` to the user data stored in `localStorage`.
- **New Verification Screen**: Created `VerifyEmailScreen` to handle code entry, expiration checks, and code resending.
- **Updated Auth Logic**:
    - Sign up now redirects to the verification screen.
    - Login is blocked for unverified users, redirecting them to verification.
    - App startup checks for pending verifications.

## Verification Steps

### 1. Sign Up & Verify
1.  Open the app and go to **Sign Up**.
2.  Create a new account.
3.  You should be redirected to the **Verify Email** screen.
4.  Note the **Demo Code** displayed on the screen.
5.  Enter the code and click **Verify Email**.
6.  You should be logged in and redirected to the main dashboard.

### 2. Block Unverified Login
1.  Sign up a new user but **do not** verify.
2.  Refresh the page (or close/reopen).
3.  You should still see the **Verify Email** screen.
4.  Click "Back to login" (if available) or clear `mindtrack.pendingVerificationUserId` in console to force login screen.
5.  Try to log in with the unverified user.
6.  You should be redirected back to the **Verify Email** screen.

### 3. Expiration Check
1.  Sign up a new user.
2.  Wait for 15 minutes (or manually edit `mindtrack.users` in localStorage to set `verificationCodeCreatedAt` to a past time).
3.  Try to enter the correct code.
4.  You should see an error: "Verification code has expired".

### 4. Resend Code
1.  On the verification screen, click **Resend code**.
2.  Verify that a **new code** is displayed.
3.  Verify that the expiration timer has reset (you can verify the new code immediately).

## Technical Details
- **Storage**: All data is stored in `localStorage` under `mindtrack.users`.
- **Security**: This is a simulation. Codes are generated client-side and displayed for demo purposes. In a real app, this would be handled by a backend.
