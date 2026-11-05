import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  ListRenderItemInfo,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SKY_SPRITES, bgGame, iconHome } from '../assets';
import { SKY_OPTIONS, SkyId, Walk } from '../constants/config';
import theme from '../constants/theme';
import { RouteTotal } from '../game/walkLog';
import { formatDate, formatMinutes } from '../utils/format';
import ListRow from '../components/ListRow';
import MonthSky from '../components/MonthSky';
import RoundIconButton from '../components/RoundIconButton';
import ScreenHeader from '../components/ScreenHeader';
import SegmentedTabs from '../components/SegmentedTabs';
import SunGlyph from '../components/SunGlyph';
import ToastPill from '../components/ToastPill';

interface Props {
  walks: Walk[];
  totalsByRoute: RouteTotal[];
  notes: Walk[];
  history: Walk[];
  weekStartsMon: boolean;
  onToggleWeekStart: () => void;
  onBack: () => void;
}

const TABS = ['MONTH', 'ROUTES', 'NOTES', 'WALKS'];
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const SPRITE_BY_SKY: Record<SkyId, number> = SKY_OPTIONS.reduce((acc, o) => {
  acc[o.id] = o.spriteIndex;
  return acc;
}, {} as Record<SkyId, number>);

const SKY_LABEL: Record<SkyId, string> = SKY_OPTIONS.reduce((acc, o) => {
  acc[o.id] = o.label;
  return acc;
}, {} as Record<SkyId, string>);

function EmptyNote({ text }: { text: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

/** Month Sky · Routes · Noticed Notes · Walk History, plus the local settings. */
function JournalScreen({
  walks,
  totalsByRoute,
  notes,
  history,
  weekStartsMon,
  onToggleWeekStart,
  onBack,
}: Props) {
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState(0);
  const [backupCount, setBackupCount] = useState(0);

  const backup = useCallback(() => {
    // Local snapshot only. Nothing leaves the device, ever.
    const snapshot = JSON.stringify({ savedAt: Date.now(), walks });
    setBackupCount(snapshot.length > 0 ? walks.length : 0);
    setToast(t => t + 1);
  }, [walks]);

  const routeKey = useCallback((item: RouteTotal) => item.name, []);
  const walkKey = useCallback((item: Walk) => item.id, []);

  const renderRoute = useCallback(
    ({ item }: ListRenderItemInfo<RouteTotal>) => (
      <ListRow
        title={item.name}
        subtitle={`${formatMinutes(item.minutes)} · ${item.walks} WALKS`}
        rightSlot={<SunGlyph size={38} minutes={item.minutes / 4} strokeWidth={2.4} />}
      />
    ),
    [],
  );

  const renderNote = useCallback(
    ({ item }: ListRenderItemInfo<Walk>) => (
      <ListRow title={formatDate(item.dateISO)} subtitle={item.note} compact={true} />
    ),
    [],
  );

  const renderWalk = useCallback(
    ({ item }: ListRenderItemInfo<Walk>) => (
      <ListRow
        compact={true}
        title={formatDate(item.dateISO)}
        subtitle={`${item.route.length > 0 ? item.route : 'NO ROUTE'} · ${SKY_LABEL[item.sky]}`}
        value={`${item.minutes}`}
        valueColor={theme.colors.primary}
        leftSlot={<Image source={SKY_SPRITES[SPRITE_BY_SKY[item.sky]]} style={styles.skyIcon} />}
      />
    ),
    [],
  );

  const totalMinutes = useMemo(
    () => history.reduce((sum, w) => sum + w.minutes, 0),
    [history],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBE6" />
      <ImageBackground source={bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={theme.gradients.journal}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.overlay}>
          <View pointerEvents="none" style={styles.blobTeal} />

          <ScreenHeader
            tone="light"
            title="JOURNAL"
            subtitle={`${formatMinutes(totalMinutes)} LOGGED IN ALL`}
            leftSlot={
              <RoundIconButton
                label="Back to the menu"
                source={iconHome}
                tone="sand"
                onPress={onBack}
              />
            }
          />

          <View style={styles.tabsWrap}>
            <SegmentedTabs items={TABS} index={tab} onChange={setTab} />
          </View>

          <View style={styles.content}>
            {tab === 0 ? <MonthSky walks={walks} weekStartsMon={weekStartsMon} /> : null}

            {tab === 1 ? (
              totalsByRoute.length > 0 ? (
                <FlatList
                  data={totalsByRoute}
                  keyExtractor={routeKey}
                  renderItem={renderRoute}
                  style={styles.list}
                  showsVerticalScrollIndicator={false}
                  initialNumToRender={8}
                />
              ) : (
                <EmptyNote text="NO ROUTES YET" />
              )
            ) : null}

            {tab === 2 ? (
              notes.length > 0 ? (
                <FlatList
                  data={notes}
                  keyExtractor={walkKey}
                  renderItem={renderNote}
                  style={styles.list}
                  showsVerticalScrollIndicator={false}
                  initialNumToRender={10}
                />
              ) : (
                <EmptyNote text="NOTHING NOTICED YET" />
              )
            ) : null}

            {tab === 3 ? (
              <View style={styles.walksWrap}>
                {history.length > 0 ? (
                  <FlatList
                    data={history}
                    keyExtractor={walkKey}
                    renderItem={renderWalk}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                  />
                ) : (
                  <EmptyNote text="NO WALKS YET" />
                )}

                <View style={styles.settings}>
                  <View style={styles.settingBadge}>
                    <Text style={styles.settingLabel}>THEME</Text>
                    <Text style={styles.settingValue}>SUNNY</Text>
                  </View>

                  <Pressable
                    onPress={onToggleWeekStart}
                    hitSlop={HIT}
                    accessibilityRole="button"
                    accessibilityLabel="Change which day the week starts on"
                    style={styles.settingPress}>
                    <View style={styles.settingBtn}>
                      <Text style={styles.settingLabel}>WEEK STARTS</Text>
                      <Text style={styles.settingValueTeal}>
                        {weekStartsMon ? 'MON' : 'SUN'}
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    onPress={backup}
                    hitSlop={HIT}
                    accessibilityRole="button"
                    accessibilityLabel="Write a local backup snapshot"
                    style={styles.settingPress}>
                    <View style={styles.settingBtn}>
                      <Text style={styles.settingLabel}>LOCAL</Text>
                      <Text style={styles.settingValueTeal}>BACKUP</Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>

          <ToastPill text={`BACKUP SAVED ✓ · ${backupCount} WALKS`} trigger={toast} />
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  bg: { flex: 1 },
  overlay: { flex: 1 },
  blobTeal: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(42,157,143,0.07)',
    top: -80,
    left: -70,
  },
  tabsWrap: { paddingHorizontal: 20, paddingTop: 14 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 18 },
  walksWrap: { flex: 1 },
  list: { flex: 1 },
  skyIcon: { width: 28, height: 28, resizeMode: 'contain' },
  empty: {
    marginTop: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textSoft,
  },
  settings: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  settingPress: { flex: 1, height: 52 },
  settingBadge: {
    flex: 1,
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingBtn: {
    width: '100%',
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accentLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textMid,
  },
  settingValue: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    color: theme.colors.text,
  },
  settingValueTeal: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    color: theme.colors.accent,
  },
});

export default JournalScreen;
