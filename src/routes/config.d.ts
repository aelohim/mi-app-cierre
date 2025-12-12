// src/routes.config.d.ts
import { ReactNode } from 'react';

export interface AppRoute {
  path: string;
  element: ReactNode;
  title: string;
  requiresClosed?: boolean;
  protected?: boolean;
}

declare const routesConfig: AppRoute[];
export default routesConfig;