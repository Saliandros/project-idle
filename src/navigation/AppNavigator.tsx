import { useState } from 'react';

import { AppRoute } from '../constants/routes';
import { DetailsPage } from '../pages/DetailsPage';
import { HomePage } from '../pages/HomePage';
import { SettingsPage } from '../pages/SettingsPage';

export function AppNavigator() {
  const [route, setRoute] = useState<AppRoute>(AppRoute.Home);

  if (route === AppRoute.Details) {
    return <DetailsPage onNavigate={setRoute} />;
  }

  if (route === AppRoute.Settings) {
    return <SettingsPage onNavigate={setRoute} />;
  }

  return <HomePage onNavigate={setRoute} />;
}