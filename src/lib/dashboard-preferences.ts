export type DashboardViewMode = 'table' | 'cards';

export interface DashboardPreferences {
  autoGenerateSlugs: boolean;
  defaultPostPublished: boolean;
  defaultProjectFeatured: boolean;
  defaultProjectVisible: boolean;
  postsViewMode: DashboardViewMode;
  projectsViewMode: DashboardViewMode;
}

export const DASHBOARD_PREFERENCES_STORAGE_KEY = 'dashboard-preferences';

export const defaultDashboardPreferences: DashboardPreferences = {
  autoGenerateSlugs: true,
  defaultPostPublished: false,
  defaultProjectFeatured: false,
  defaultProjectVisible: true,
  postsViewMode: 'table',
  projectsViewMode: 'table',
};
