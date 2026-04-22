import { useState } from 'react';

import { AppRoute } from '../constants/routes';
import { Champions } from '../pages/Champions';
import { EmbassyExchange } from '../pages/EmbassyExchange';
import { Factions } from '../pages/Factions';
import { Frontpage } from '../pages/Frontpage';
import { TestUser } from '../types';

type AppNavigatorProps = {
  currentUser: TestUser;
};

export function AppNavigator({ currentUser }: AppNavigatorProps) {
  const [route, setRoute] = useState<AppRoute>(AppRoute.Home);

  if (route === AppRoute.Embassy_Exchange) {
    return <EmbassyExchange onNavigate={setRoute} />;
  }

  if (route === AppRoute.Champions) {
    return <Champions onNavigate={setRoute} />;
  }

  if (route === AppRoute.Factions) {
    return <Factions onNavigate={setRoute} />;
  }

  return <Frontpage onNavigate={setRoute} currentUser={currentUser} />;
}
