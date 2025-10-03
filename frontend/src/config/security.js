// Security configuration for route access control
export const ROUTE_ACCESS_CONFIG = {
  // Public routes - accessible without authentication
  PUBLIC_ROUTES: [
    '/loginpage',
    '/signuppage',
    '/forgotpasswordpage',
    '/email-verification',
    '/otppage'
  ],

  // Semi-public routes - accessible during authentication flow
  AUTH_FLOW_ROUTES: [
    '/roleselection',
    '/workerverification',
    '/clientsetup'
  ],

  // Protected routes - require authentication
  PROTECTED_ROUTES: [
    '/',
    '/findjobs',
    '/friends',
    '/profile',
    '/clientprofile',
    '/workerprofile',
    '/edit-profile',
    '/post-job',
    '/workhistory',
    '/job-progress',
    '/video',
    '/add-post',
    '/settings',
    '/job-application-page',
    '/notifications',
    '/jobs'
  ],

  // Admin routes - require admin role
  ADMIN_ROUTES: [
    '/admin',
    '/admin/users',
    '/admin/jobs',
    '/admin/applications',
    '/admin/reviews',
    '/admin/reports',
    '/admin/notifications',
    '/admin/settings',
    '/admin-register'
  ],

  // Role-specific access
  ROLE_ACCESS: {
    worker: ['all_protected'],
    client: ['all_protected'],
    admin: ['all_protected', 'admin_routes']
  }
};

// Function to check if a route requires authentication
export const isProtectedRoute = (pathname) => {
  return ROUTE_ACCESS_CONFIG.PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  ) || isAdminRoute(pathname);
};

// Function to check if a route is admin-only
export const isAdminRoute = (pathname) => {
  return ROUTE_ACCESS_CONFIG.ADMIN_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route)
  );
};

// Function to check if a route is public
export const isPublicRoute = (pathname) => {
  return ROUTE_ACCESS_CONFIG.PUBLIC_ROUTES.includes(pathname) ||
         ROUTE_ACCESS_CONFIG.AUTH_FLOW_ROUTES.includes(pathname);
};

// Function to validate user access to a specific route
export const hasRouteAccess = (user, pathname) => {
  // Public routes are accessible to everyone
  if (isPublicRoute(pathname)) {
    return true;
  }

  // User must be authenticated for protected routes
  if (!user) {
    return false;
  }

  // Admin routes require admin role
  if (isAdminRoute(pathname)) {
    return user.userType === 'admin';
  }

  // All authenticated users can access general protected routes
  if (isProtectedRoute(pathname)) {
    return true;
  }

  return false;
};