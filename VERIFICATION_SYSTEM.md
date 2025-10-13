# Worker Verification System Implementation

## Overview

This document describes the worker verification system implemented for Workie.lk. The system allows admin to manually verify workers by reviewing their ID documents and checking their rating history before granting them a verified status.

## Business Requirements

- **Goal**: Connect trusted and skilled verified workers with clients
- **Process**: Admin manually verifies workers by:
  1. Reviewing both front and back ID photos
  2. Checking if worker's average rating is greater than 3.0
  3. Setting `isVerified = true` if approved
- **Display**: Show verified badge on worker profiles visible to clients

## Technical Implementation

### Backend (API Endpoints)

#### 1. Get Pending Verifications

**Endpoint**: `GET /api/admin/workers/pending-verification`

**Query Parameters**:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response**:

```json
{
  "success": true,
  "data": {
    "workers": [
      {
        "_id": "worker_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phoneNumber": "+1234567890",
        "profilePicture": "url",
        "verificationDocuments": {
          "idPhotoFront": "url",
          "idPhotoBack": "url"
        },
        "avgRating": "4.5",
        "reviewCount": 12,
        "createdAt": "2024-01-01"
      }
    ],
    "totalPages": 5,
    "currentPage": 1,
    "total": 48
  }
}
```

**Logic**:

- Finds workers with `userType: 'worker'`
- Has both `idPhotoFront` and `idPhotoBack` uploaded
- `isVerified: false`
- Calculates average rating from Review collection
- Supports pagination

---

#### 2. Get Worker Verification Details

**Endpoint**: `GET /api/admin/workers/:id/verification-details`

**Response**:

```json
{
  "success": true,
  "data": {
    "worker": {
      /* full worker data */
    },
    "avgRating": "4.5",
    "reviewCount": 12,
    "completedJobs": 8,
    "reviews": [
      /* latest 10 reviews */
    ],
    "verificationDocuments": {
      "idPhotoFront": "url",
      "idPhotoBack": "url"
    }
  }
}
```

**Logic**:

- Fetches complete worker details
- Calculates average rating
- Gets latest 10 reviews with reviewer and job details
- Counts completed jobs

---

#### 3. Verify Worker (Approve)

**Endpoint**: `POST /api/admin/workers/:id/verify`

**Request Body**:

```json
{
  "notes": "ID verified and rating meets requirements" // optional
}
```

**Response**:

```json
{
  "success": true,
  "message": "Worker verified successfully",
  "data": {
    "worker": {
      "_id": "worker_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "isVerified": true,
      "avgRating": "4.5",
      "reviewCount": 12
    }
  }
}
```

**Logic**:

1. Validates worker exists and is a worker type
2. Checks ID documents are uploaded
3. Calculates average rating from reviews
4. **If reviews exist**: Rating must be > 3.0
5. **If no reviews yet**: Allows verification (new worker)
6. Sets `isVerified = true`
7. Creates success notification for worker

**Error Responses**:

- `400`: Worker has not uploaded ID documents
- `400`: Worker's rating ≤ 3.0 (includes rating details)
- `404`: Worker not found

---

#### 4. Reject Verification

**Endpoint**: `POST /api/admin/workers/:id/reject-verification`

**Request Body**:

```json
{
  "reason": "ID photos are unclear. Please upload clearer images." // required
}
```

**Response**:

```json
{
  "success": true,
  "message": "Verification request rejected",
  "data": {
    "worker": {
      "_id": "worker_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "isVerified": false
    }
  }
}
```

**Logic**:

- Ensures `isVerified` remains `false`
- Creates warning notification for worker with rejection reason
- Reason is required and sent to worker

---

#### 5. Revoke Verification

**Endpoint**: `POST /api/admin/workers/:id/revoke-verification`

**Request Body**:

```json
{
  "reason": "Multiple complaints received about fake credentials" // required
}
```

**Response**:

```json
{
  "success": true,
  "message": "Worker verification revoked successfully",
  "data": {
    "worker": {
      "_id": "worker_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "isVerified": false
    }
  }
}
```

**Logic**:

- Sets `isVerified = false` for already verified worker
- Creates error notification for worker with revocation reason
- Used when verification needs to be removed after granted

---

### Frontend (Admin Panel)

#### AdminVerifications Component (`/admin/verifications`)

**Features**:

1. **Pending Verifications List**

   - Table view with pagination
   - Shows worker details: name, photo, contact, rating, reviews count
   - Displays eligibility status (green = eligible, red = rating ≤ 3)
   - Quick "Review" button for each worker

2. **Verification Review Modal**

   - **Personal Information Section**: Name, email, phone, location
   - **Performance Metrics Section**: Rating, review count, completed jobs, member since
   - **ID Documents Section**:
     - Side-by-side display of front and back ID photos
     - Click to enlarge in full-screen modal
     - Hover effect for preview
   - **Eligibility Indicator**:
     - Green badge: "Eligible for Verification"
     - Red badge: "Not Eligible - Rating ≤ 3.0"
   - **Recent Reviews**: Latest reviews with ratings and comments
   - **Action Buttons**:
     - "Verify Worker" (green, disabled if rating ≤ 3)
     - "Reject" (red, opens rejection reason modal)

3. **Image Preview Modal**

   - Full-screen view of ID documents
   - Dark backdrop with close button
   - Clear title (ID Card - Front/Back)

4. **Rejection Modal**
   - Text area for rejection reason (required)
   - Confirmation button
   - Reason is sent to worker as notification

**Design**:

- Gradient headers (blue to indigo)
- Blur backdrop effects
- Professional card layouts
- Responsive design (mobile-friendly)
- Loading states with spinners
- Color-coded rating badges
- Status indicators

**Navigation**:

- Added to Admin sidebar with ShieldCheck icon
- Route: `/admin/verifications`
- Positioned between Applications and Reviews

---

### Frontend (Worker Profile)

#### Verified Badge Display

**Location**: ProfileHeader component

**Implementation**:

```jsx
{
  profileData.isVerified && (
    <div
      className="flex items-center gap-1 bg-blue-500 px-2 py-1 rounded-full"
      title="Verified Worker"
    >
      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      <span className="text-xs sm:text-sm font-semibold text-white">
        Verified
      </span>
    </div>
  );
}
```

**Features**:

- Displays next to worker's name in profile header
- Blue badge with shield checkmark icon
- Shows "Verified" text
- Responsive sizing (smaller on mobile)
- Visible to all users viewing the profile
- Only shown if `isVerified === true`

**Data Flow**:

- `User.isVerified` field fetched from backend
- Mapped to `profileData.isVerified` in Profile component
- Passed to ProfileHeader component
- Rendered conditionally

---

## Database Schema

### User Model (Existing)

```javascript
{
  userType: { type: String, enum: ['worker', 'client', 'admin'] },
  isVerified: { type: Boolean, default: false },
  verificationDocuments: {
    idPhotoFront: String,
    idPhotoBack: String,
    publicIds: {
      idPhotoFront: String,
      idPhotoBack: String
    }
  },
  // ... other fields
}
```

### Review Model (Existing)

```javascript
{
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: Date
}
```

### Notification Model (Existing)

```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  message: String,
  type: { type: String, enum: ['info', 'success', 'warning', 'error'] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}
```

---

## Verification Rules

### Eligibility Criteria

1. **ID Documents**: Both front and back ID photos must be uploaded
2. **Rating Requirement**:
   - If worker has reviews: Average rating must be > 3.0
   - If worker has no reviews: Automatically eligible (new worker)
3. **User Type**: Must be `userType: 'worker'`

### Rating Calculation

```javascript
const reviews = await Review.find({ reviewee: worker._id });
const avgRating =
  reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
```

### Verification States

- **Pending**: Has uploaded documents, `isVerified = false`, waiting for admin review
- **Verified**: Admin approved, `isVerified = true`, badge displayed
- **Rejected**: Admin rejected with reason, `isVerified = false`, worker notified
- **Revoked**: Previously verified but removed, `isVerified = false`, worker notified

---

## Security & Permissions

### Authentication

- All admin endpoints protected with `auth` middleware
- Requires `requireAdmin` middleware (checks `userType === 'admin'`)
- JWT token validation

### Authorization

- Only admins can access verification endpoints
- Workers can only upload their own documents
- Clients can view verified badges

---

## User Experience

### For Workers

1. Upload both front and back ID photos in profile settings
2. Wait for admin review (status: Pending)
3. Receive notification when verified or rejected
4. If approved: Verified badge appears on profile
5. If rejected: Notification explains reason, can reupload

### For Admins

1. Navigate to "Verifications" in admin panel
2. See list of pending verification requests
3. Click "Review" to see full details
4. View ID photos (click to enlarge)
5. Check rating and review history
6. Approve (if eligible) or Reject (with reason)
7. Worker receives notification immediately

### For Clients

1. Browse worker profiles
2. See verified badge next to verified worker names
3. Trust verified workers for hiring

---

## Notifications

### Verification Approved

- **Title**: "✅ Verification Approved!"
- **Message**: "Congratulations! Your account has been verified. You can now display the verified badge on your profile."
- **Type**: success
- **Includes**: Admin notes (if provided)

### Verification Rejected

- **Title**: "❌ Verification Not Approved"
- **Message**: "Your verification request has been reviewed. Reason: {reason}. Please update your documents and resubmit."
- **Type**: warning
- **Includes**: Rejection reason

### Verification Revoked

- **Title**: "⚠️ Verification Revoked"
- **Message**: "Your verification status has been revoked. Reason: {reason}. Please contact support if you believe this is an error."
- **Type**: error
- **Includes**: Revocation reason

---

## Testing Checklist

### Backend API Testing

- [ ] GET pending verifications with pagination
- [ ] GET verification details for specific worker
- [ ] POST verify worker with rating > 3
- [ ] POST verify new worker with no reviews
- [ ] POST verify worker with rating ≤ 3 (should fail)
- [ ] POST verify without ID documents (should fail)
- [ ] POST reject with reason
- [ ] POST reject without reason (should fail)
- [ ] POST revoke verification
- [ ] Verify notifications are created correctly

### Frontend Testing

- [ ] Verifications page loads and displays pending workers
- [ ] Pagination works correctly
- [ ] Rating and review count display accurately
- [ ] Eligibility status shows correct color (green/red)
- [ ] Review modal opens with all details
- [ ] ID photos display and enlarge correctly
- [ ] Approve button disabled when rating ≤ 3
- [ ] Rejection modal requires reason
- [ ] Success/error toasts display correctly
- [ ] List refreshes after approve/reject
- [ ] Verified badge displays on worker profiles
- [ ] Badge only shows for verified workers

### Integration Testing

- [ ] End-to-end verification flow
- [ ] Worker receives notifications
- [ ] Badge appears after verification
- [ ] Badge disappears after revocation
- [ ] Rating recalculation is accurate

---

## Future Enhancements

1. **Automated Document Verification**: OCR/AI to verify ID authenticity
2. **Verification Expiry**: Require reverification after X years
3. **Document Upload History**: Track all submitted documents
4. **Verification Levels**: Bronze, Silver, Gold badges based on criteria
5. **Email Notifications**: Send emails in addition to in-app notifications
6. **Verification Analytics**: Track approval rates, average processing time
7. **Bulk Verification**: Approve/reject multiple workers at once
8. **Verification Queue Filters**: Sort by rating, date submitted, etc.
9. **Worker Dashboard**: Show verification status and progress
10. **Mobile App Support**: Push notifications for verification updates

---

## Files Modified/Created

### Backend

- ✅ `backend/routes/admin.js` - Added 5 new verification endpoints
- ✅ `backend/models/User.js` - Already has `isVerified` and `verificationDocuments`
- ✅ `backend/models/Review.js` - Used for rating calculations
- ✅ `backend/models/Notification.js` - Used for worker notifications

### Frontend

- ✅ `frontend/src/pages/Admin/AdminVerifications.jsx` - New verification management page
- ✅ `frontend/src/pages/Admin/AdminLayout.jsx` - Added Verifications menu item
- ✅ `frontend/src/App.jsx` - Added verification route
- ✅ `frontend/src/components/UserProfile/ProfileHeader.jsx` - Added verified badge display
- ✅ `frontend/src/pages/Profile/Profile.jsx` - Already maps `isVerified` to profile data

---

## Support & Maintenance

### Common Issues

**Issue**: Worker not showing in pending list

- **Solution**: Check if both ID photos are uploaded and `isVerified` is `false`

**Issue**: Cannot approve worker with rating 3.0

- **Solution**: Rating must be strictly greater than 3.0, not equal to 3.0

**Issue**: Verified badge not showing

- **Solution**: Ensure `isVerified` field is being fetched and passed to ProfileHeader

**Issue**: Notifications not received

- **Solution**: Check Notification model creation and user ID matching

### Logs to Check

- Admin verification actions: `console.log` in admin routes
- Rating calculations: Review queries and aggregation
- Badge display: Profile data mapping in Profile.jsx

---

## Conclusion

The worker verification system is now fully implemented with:

- ✅ 5 admin API endpoints for verification management
- ✅ Professional admin UI for reviewing workers
- ✅ Verified badge display on worker profiles
- ✅ Notification system for worker feedback
- ✅ Rating-based eligibility checks
- ✅ ID document review with image preview
- ✅ Complete audit trail

This system ensures that clients can trust verified workers on the Workie.lk platform, enhancing the overall user experience and platform credibility.
