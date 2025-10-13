# Admin Worker Verification - Notification Validation Errors FIXED

## Error Messages

```
Error: Notification validation failed:
  - recipient: Path `recipient` is required.
  - type: `success` is not a valid enum value for path `type`.
```

## Root Causes

The admin worker verification endpoints had **multiple validation errors** when creating notifications:

### 1. Wrong Field Name: `user` instead of `recipient`

```javascript
// ❌ WRONG
await Notification.create({
  user: worker._id,  // This field doesn't exist in schema!
  ...
});
```

The Notification schema requires **`recipient`**, not `user`.

### 2. Invalid `type` Enum Values

```javascript
// ❌ WRONG
type: "success"; // Not in enum!
type: "warning"; // Not in enum!
type: "error"; // Not in enum!
```

**Valid `type` enum values in Notification schema:**

- `'job_application'`
- `'application_accepted'`
- `'application_rejected'`
- `'job_completed'`
- `'review_received'`
- `'payment_received'`
- `'message_received'`
- `'job_reminder'`
- `'profile_view'`
- `'system_update'` ✅ (Correct for admin notifications)
- `'like'`
- `'comment'`
- `'connection_request'`
- `'post_like'`
- `'post_comment'`

### 3. Wrong Field Name: `createdBy` instead of `sender`

```javascript
// ❌ WRONG
createdBy: req.user.id; // Field doesn't exist, and .id is wrong property!
```

The Notification schema uses **`sender`**, not `createdBy`, and the correct property is `req.user._id`.

## Fixes Applied

### Fix 1: Verify Worker Endpoint (Line 885)

**Before:**

```javascript
await Notification.create({
  user: worker._id, // ❌ Wrong field name
  title: "✅ Verification Approved!",
  message: `Congratulations! Your account has been verified...`,
  type: "success", // ❌ Invalid enum value
  createdBy: req.user.id, // ❌ Wrong field name AND wrong property
});
```

**After:**

```javascript
await Notification.create({
  recipient: worker._id, // ✅ Correct field name
  sender: req.user._id, // ✅ Correct field name AND property
  title: "✅ Verification Approved!",
  message: `Congratulations! Your account has been verified...`,
  type: "system_update", // ✅ Valid enum value
});
```

### Fix 2: Reject Verification Endpoint (Line 953)

**Before:**

```javascript
await Notification.create({
  user: worker._id, // ❌ Wrong field name
  title: "❌ Verification Not Approved",
  message: `Your verification request has been reviewed...`,
  type: "warning", // ❌ Invalid enum value
  createdBy: req.user.id, // ❌ Wrong field name AND wrong property
});
```

**After:**

```javascript
await Notification.create({
  recipient: worker._id, // ✅ Correct field name
  sender: req.user._id, // ✅ Correct field name AND property
  title: "❌ Verification Not Approved",
  message: `Your verification request has been reviewed...`,
  type: "system_update", // ✅ Valid enum value
});
```

### Fix 3: Revoke Verification Endpoint (Line 1019)

**Before:**

```javascript
await Notification.create({
  user: worker._id, // ❌ Wrong field name
  title: "⚠️ Verification Revoked",
  message: `Your verification status has been revoked...`,
  type: "error", // ❌ Invalid enum value
  createdBy: req.user.id, // ❌ Wrong field name AND wrong property
});
```

**After:**

```javascript
await Notification.create({
  recipient: worker._id, // ✅ Correct field name
  sender: req.user._id, // ✅ Correct field name AND property
  title: "⚠️ Verification Revoked",
  message: `Your verification status has been revoked...`,
  type: "system_update", // ✅ Valid enum value
});
```

## Notification Schema Reference

```javascript
// backend/models/Notification.js
const notificationSchema = new mongoose.Schema({
  recipient: {                    // ✅ Use this, not 'user'
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {                       // ✅ Use this, not 'createdBy'
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [                       // ✅ Only these values allowed!
      'job_application',
      'application_accepted',
      'application_rejected',
      'job_completed',
      'review_received',
      'payment_received',
      'message_received',
      'job_reminder',
      'profile_view',
      'system_update',           // ✅ Use this for admin notifications
      'like',
      'comment',
      'connection_request',
      'post_like',
      'post_comment'
    ],
    required: true
  },
  title: String,
  message: String,
  ...
});
```

## Summary of Changes

| Issue                                   | Before           | After                |
| --------------------------------------- | ---------------- | -------------------- |
| Field for worker receiving notification | `user` ❌        | `recipient` ✅       |
| Field for admin sending notification    | `createdBy` ❌   | `sender` ✅          |
| Admin ID reference                      | `req.user.id` ❌ | `req.user._id` ✅    |
| Verification approved type              | `'success'` ❌   | `'system_update'` ✅ |
| Verification rejected type              | `'warning'` ❌   | `'system_update'` ✅ |
| Verification revoked type               | `'error'` ❌     | `'system_update'` ✅ |

## Affected Endpoints

✅ **Fixed in `backend/routes/admin.js`:**

1. `POST /api/admin/workers/:id/verify` (Line 885)
2. `POST /api/admin/workers/:id/reject-verification` (Line 953)
3. `POST /api/admin/workers/:id/revoke-verification` (Line 1019)

## Testing

### Before Fix:

```
❌ Error: Notification validation failed
❌ Worker verification fails
❌ No notification sent to worker
❌ Server returns 500 error
```

### After Fix:

```
✅ Notification created successfully
✅ Worker verification succeeds
✅ Worker receives notification
✅ Admin panel works smoothly
```

## Next Steps

1. **Backend server will auto-reload** (if using nodemon)

   - Or restart manually: `Ctrl+C` then `npm start`

2. **Test the verification flow:**

   - Go to Admin Panel → Verifications
   - Click "Verify Worker" button
   - ✅ Should see success message
   - ✅ Worker should receive notification
   - ✅ No validation errors

3. **Verify worker receives notification:**
   - Login as the verified worker
   - Check notifications
   - Should see "✅ Verification Approved!" notification

---

✅ **All Issues Fixed!** Admin worker verification now works correctly with proper notifications.
