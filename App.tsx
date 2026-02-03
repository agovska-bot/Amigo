
import React from 'react';
import { useAppContext } from './context/AppContext';
import { Screen } from './types';
import HomeScreen from './screens/HomeScreen';
import MoveScreen from './screens/MoveScreen';
import CalmZoneScreen from './screens/CalmZoneScreen';
import SocialDecoderScreen from './screens/SocialDecoderScreen';
import PracticeRoomScreen from './screens/PracticeRoomScreen';
import Toast from './components/Toast';
import WelcomeScreen from './screens/LanguageSelectionScreen';

const App: React.FC = () => {
  const { currentScreen, toastMessage, language, birthDate, userName } = useAppContext();

  if (!language || !birthDate || !userName) {
    return <WelcomeScreen />;
  }

  const renderContent = () => {
    switch (currentScreen) {
      case Screen.Home: return <HomeScreen />;
      case Screen.SocialDecoder: return <SocialDecoderScreen />;
      case Screen.PracticeRoom: return <PracticeRoomScreen />;
      case Screen.CalmZone: return <CalmZoneScreen />;
      case Screen.Move: return <MoveScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <>
      {renderContent()}
      {toastMessage && <Toast message={toastMessage} />}
    </>
  );
};

export default App;
