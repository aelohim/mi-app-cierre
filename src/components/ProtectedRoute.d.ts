// src/components/ProtectedRoute.d.ts
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiresClosed?: boolean;
}

declare const ProtectedRoute: React.FC<ProtectedRouteProps>;
export default ProtectedRoute;