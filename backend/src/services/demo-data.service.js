const DEMO_ACTIVITIES = [
  { id: 'demo-12', name: 'Sunday Long Run', date: 'September 13, 2026', distance: 12.4, duration: '1:08:12', pace: '5:30/km', elevation: '88 m', points: 124, type: 'Run' },
  { id: 'demo-11', name: 'Saturday Club Run', date: 'September 12, 2026', distance: 8.6, duration: '0:46:21', pace: '5:23/km', elevation: '54 m', points: 86, type: 'Run' },
  { id: 'demo-10', name: 'Friday Easy Run', date: 'September 11, 2026', distance: 6.2, duration: '0:35:44', pace: '5:46/km', elevation: '38 m', points: 62, type: 'Run' },
  { id: 'demo-09', name: 'Thursday Time Trial', date: 'September 10, 2026', distance: 5.0, duration: '0:25:18', pace: '5:04/km', elevation: '22 m', points: 50, type: 'Time Trial' },
  { id: 'demo-08', name: 'Wednesday Recovery', date: 'September 9, 2026', distance: 4.4, duration: '0:28:03', pace: '6:23/km', elevation: '31 m', points: 44, type: 'Run' },
  { id: 'demo-07', name: 'Tuesday Club Run', date: 'September 8, 2026', distance: 7.1, duration: '0:39:55', pace: '5:37/km', elevation: '46 m', points: 71, type: 'Run' },
  { id: 'demo-06', name: 'Weekend Easy Run', date: 'September 5, 2026', distance: 6.8, duration: '0:38:19', pace: '5:38/km', elevation: '41 m', points: 68, type: 'Run' },
  { id: 'demo-05', name: 'Midweek Run', date: 'September 2, 2026', distance: 5.7, duration: '0:32:41', pace: '5:44/km', elevation: '35 m', points: 57, type: 'Run' },
  { id: 'demo-04', name: 'Month Start Run', date: 'September 1, 2026', distance: 5.3, duration: '0:30:33', pace: '5:46/km', elevation: '28 m', points: 53, type: 'Run' },
  { id: 'demo-03', name: 'August Long Run', date: 'August 30, 2026', distance: 10.2, duration: '0:56:40', pace: '5:33/km', elevation: '72 m', points: 102, type: 'Run' },
  { id: 'demo-02', name: 'August Club Run', date: 'August 27, 2026', distance: 7.4, duration: '0:42:18', pace: '5:43/km', elevation: '43 m', points: 74, type: 'Run' },
  { id: 'demo-01', name: 'August Time Trial', date: 'August 25, 2026', distance: 5.0, duration: '0:25:39', pace: '5:08/km', elevation: '19 m', points: 50, type: 'Time Trial' },
];

export function demoActivities() {
  return DEMO_ACTIVITIES.map((activity) => ({ ...activity }));
}
