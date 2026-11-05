/**
 * Sunlight Walk Log — state machine only, no gameplay lives here.
 */
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenFade from './src/components/ScreenFade';
import theme from './src/constants/theme';
import { useWalkLog, WalkDraft } from './src/hooks/useWalkLog';
import GameOverScreen, { SaveTarget } from './src/screens/GameOverScreen';
import GameScreen from './src/screens/GameScreen';
import JournalScreen from './src/screens/JournalScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'journal';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [session, setSession] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [revealKey, setRevealKey] = useState(0);

  const log = useWalkLog();

  const goMenu = useCallback(() => {
    setRevealKey(k => k + 1);
    setScreen('menu');
  }, []);

  const goJournal = useCallback(() => setScreen('journal'), []);

  const startWalk = useCallback(() => {
    setElapsedSec(0);
    setSession(s => s + 1);
    setScreen('game');
  }, []);

  const manualEntry = useCallback(() => {
    setElapsedSec(0);
    setSession(s => s + 1);
    setScreen('gameover');
  }, []);

  const handleGameOver = useCallback((secs: number) => {
    setElapsedSec(secs);
    setSession(s => s + 1);
    setScreen('gameover');
  }, []);

  const handleSave = useCallback(
    (draft: WalkDraft, target: SaveTarget) => {
      log.addWalk(draft);
      setRevealKey(k => k + 1);
      if (target === 'game') {
        setElapsedSec(0);
        setSession(s => s + 1);
        setScreen('game');
        return;
      }
      if (target === 'journal') {
        setScreen('journal');
        return;
      }
      setScreen('menu');
    },
    [log],
  );

  return (
    <View style={styles.root}>
      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <ScreenFade direction="left">
          <MenuScreen
            week={log.week}
            weekMinutes={log.weekMinutes}
            streak={log.streak}
            routeCount={log.routes.length}
            revealKey={revealKey}
            onStart={startWalk}
            onManual={manualEntry}
            onJournal={goJournal}
          />
        </ScreenFade>
      ) : null}

      {screen === 'game' ? (
        <ScreenFade key={`game-${session}`} direction="right">
          <GameScreen
            todayMinutes={log.todayMinutes}
            weekMinutes={log.weekMinutes}
            best={log.best}
            onGameOver={handleGameOver}
            onMenu={goMenu}
          />
        </ScreenFade>
      ) : null}

      {screen === 'gameover' ? (
        <ScreenFade key={`over-${session}`} direction="right">
          <GameOverScreen
            elapsedSec={elapsedSec}
            routes={log.routes}
            onSave={handleSave}
            onAddRoute={log.addRoute}
          />
        </ScreenFade>
      ) : null}

      {screen === 'journal' ? (
        <ScreenFade direction="right">
          <JournalScreen
            walks={log.walks}
            totalsByRoute={log.totalsByRoute}
            notes={log.notes}
            history={log.history}
            weekStartsMon={log.weekStartsMon}
            onToggleWeekStart={log.toggleWeekStart}
            onBack={goMenu}
          />
        </ScreenFade>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
});

export default App;
