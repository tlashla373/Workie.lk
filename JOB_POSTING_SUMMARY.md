# Job Posting: Architecture, Gaps, and Recommendations

This document summarizes the current Job Posting implementation in the backend (data model, routes, validation, and media handling), highlights gaps, and recommends targeted improvements.

## What exists today

### Data model (`backend/models/Job.js`)

- Core fields
  - title (required, <= 100 chars)
  - description (required, <= 2000 chars)
  - category (required; enum: cleaning, gardening, plumbing, electrical, carpentry, painting, delivery, tutoring, pet-care, elderly-care, cooking, photography, event-planning, repair-services, moving, other)
  - budget: { amount (required, >= 0), currency (default LKR), type (enum fixed|hourly|negotiable) }
  - location: { address (required), city (required), state?, coordinates [lng, lat] with 2dsphere index }
  - client: ObjectId<User> (required)
  - requirements: [string]
  - skills: [string]
  - duration: { estimated?, startDate?, endDate?, isFlexible (bool) }
  - status: enum open|in-progress|completed|cancelled|paused (default open)
  - urgency: enum low|medium|high|urgent (default medium)
  - images: [{ url, description }]
  - applicationsCount (number, default 0)
  - maxApplicants (number, default 50)
  - isRemote (bool, default false)
  - experienceLevel: enum beginner|intermediate|expert|any (default any)
  - assignedWorker: ObjectId<User>
  - completedAt: Date
  - isActive: bool (soft delete flag, default true)
- Indexes
  - category+status, location.city+status, client+status, createdAt desc, budget.amount
  - 2dsphere on location.coordinates
- Virtuals
  - applications (ref Application)

### Validation middleware (`backend/middleware/validation.js`)

- validateJob enforces:
  - title: required, 5–100
  - description: required, 20–2000
  - category: enum as per model
  - budget.amount: number >= 0
  - budget.type: optional enum
  - location.address/city: required
  - urgency: optional enum
- Notably not validated yet: duration (start/end ordering), budget.currency, skills/requirements array constraints, images array structure, experienceLevel, maxApplicants (> 0), isRemote boolean, location.coordinates shape.

### Routes (`backend/routes/jobs.js`)

- GET /api/jobs (public)
  - Filters: status (default open), category, city (regex), urgency
  - Budget range: minBudget/maxBudget
  - Search: regex on title/description and skills
  - Pagination: page/limit; sorting: sortBy/sortOrder (default createdAt desc)
- GET /api/jobs/:id (public)
  - Populates client and assignedWorker
- POST /api/jobs (auth; authorize client|admin)
  - Uses validateJob; sets client = req.user.\_id
- PUT /api/jobs/:id (auth)
  - Owner or admin only
  - Restricts modifying budget/category/location when status === in-progress
  - runValidators: true
- DELETE /api/jobs/:id (auth)
  - Owner or admin only
  - Soft deletes (isActive=false, status=cancelled) unless in-progress
- GET /api/jobs/:id/applications (auth)
  - Owner or admin only
  - Populates application worker and nested profile summary
- POST /api/jobs/:id/assign/:workerId (auth)
  - Owner or admin only; job must be open; requires an existing pending application by the worker
  - Sets job.assignedWorker, job.status = in-progress; accepts selected application; rejects others
- POST /api/jobs/:id/complete (auth)
  - Owner, assigned worker, or admin; job must be in-progress; sets status completed and completedAt
- GET /api/jobs/user/my-jobs (auth)
  - For clients: posted jobs with optional status filter
  - For workers: jobs via their applications (adds applicationStatus and applicationId)

### Media handling (`backend/routes/media.js`)

- Cloudinary wiring exists for post media and single file uploads, returning file metadata.
- Job images are not integrated: uploading media does not persist to a Job document’s `images` field.

## Strengths

- Clean separation: model/validation/routes; good default indexes and filters.
- Solid owner/admin authorization patterns for update/delete/assignment/completion.
- Reasonable search/pagination, and soft delete semantics.
- Assignment flow correctly rejects competing pending applications.

## Gaps and risks

- Missing media → Job linkage
  - No endpoint to upload images for a specific job and persist to `job.images` (with Cloudinary publicId for later deletion).
- Validation coverage gaps
  - No checks for duration consistency (startDate <= endDate), maxApplicants > 0, images array item shape, budget.currency, isRemote boolean, experienceLevel enum on input, location.coordinates array ([lng, lat]).
- Status transitions not strictly enforced
  - PUT allows arbitrary status changes (except some in-progress restrictions). E.g., open → completed without assignedWorker.
- Search and performance
  - Regex search on strings; no text index or weighted search fields; no geospatial queries even though 2dsphere is available.
- Sorting injection risk
  - sortBy/sortOrder not whitelisted; could allow sorting by unexpected fields.
- Concurrency and atomicity
  - Assign/complete flows aren’t wrapped in MongoDB transactions; race conditions are possible under simultaneous requests.
- Missing triggers/notifications
  - No notifications/email for job lifecycle events (created, application received/accepted/rejected, assigned, completed).
- Rate limiting and spam control
  - No per-user rate limit or anti-spam checks on job creation.
- Admin moderation
  - Model has paused status, but admin endpoints to pause/resume jobs aren’t present.

## Recommendations (prioritized)

### 1) Job images integration (quick win)

- Add a route to attach uploaded images to a job:
  - POST /api/jobs/:id/images → accepts files via Cloudinary; updates `job.images` by pushing { url, description?, publicId }.
  - DELETE /api/jobs/:id/images/:publicId → removes from `job.images` and deletes from Cloudinary.
- Store `publicId` in the model for clean-up.
- Authorization: owner or admin.

### 2) Tighten validation and status transitions

- Extend validateJob and add a dedicated update validator:
  - duration.startDate <= endDate (if both provided); startDate >= now (optional rule).
  - budget.currency: enum [LKR, USD] (or your supported set).
  - maxApplicants: int >= 1; experienceLevel: enum as per model; isRemote: boolean; skills/requirements: array of non-empty strings (reasonable max lengths).
  - location.coordinates: optional [lng, lat], both numbers in valid ranges; if present, ensure 2-element array.
- Enforce status state machine in PUT:
  - Only allow: open → in-progress (requires assignedWorker), in-progress → completed | cancelled, open → paused | cancelled, paused → open.
  - Prevent open → completed or completed → any.

### 3) Safer sorting and input sanitization

- Whitelist sortBy to: [createdAt, budget.amount, urgency, status]. Reject others.
- Sanitize search inputs; optionally cap regex length to avoid heavy queries.

### 4) Better search and geospatial support

- Add a text index on title and description with weights; support `$text` search when `search` is provided.
- Add optional radius search with `near` + `maxDistance` using location.coordinates.

### 5) Transactional assignment (robustness)

- Use a MongoDB session/transaction around:
  - verify job is open; verify pending application exists; set job.assignedWorker + status; accept selected app; reject others.
- Alternatively, an atomic conditional update: `findOneAndUpdate({_id, status:'open'}, {$set: {assignedWorker, status:'in-progress'}})` and proceed if matched.

### 6) Notifications and emails (engagement)

- Hook into job lifecycle:
  - Job created → (optional) notify worker segments by category.
  - Application submitted → notify client.
  - Application accepted/rejected → notify worker.
  - Assigned → notify worker; Completed → notify both.

### 7) Admin moderation endpoints

- POST /api/admin/jobs/:id/pause and /resume; requires admin auth; sets status paused/open.

### 8) Rate limiting for job creation

- Per-user rate limiter (e.g., max N job creates per hour/day) to control spam.

## Quick diffs to consider later (code pointers only)

- New route file: `backend/routes/jobMedia.js` or extend `backend/routes/media.js` for job-specific media endpoints.
- Update model: add `images[].publicId` and consider `images[].width/height` for responsive UI.
- Update validators: extend `validateJob` and create `validateJobUpdate` for PUT.
- Update routes/jobs.js: enforce status transitions and sort whitelist; optional geosearch.

## Edge cases to test

- Creating a job with minimum valid payload; with long text boundaries; with invalid category.
- Updating job while in-progress (ensure restricted fields blocked and status machine enforced).
- Assigning the same worker concurrently from two requests (should result in one success, one failure).
- Deleting a job with in-progress status (should be blocked).
- Uploading/removing job images; Cloudinary failures should roll back DB update.

## Frontend notes (next integration)

- Ensure job creation form aligns with validation (min lengths, required fields, enum options).
- Provide image picker for job images and call the new job images endpoint; show thumbnails from `job.images`.
- In listings, handle pagination/filters for category, city, budget range, urgency; show search results.

---

If you want, I can implement the job images endpoints and the status transition guards next. This is a contained change and will add visible value quickly.
