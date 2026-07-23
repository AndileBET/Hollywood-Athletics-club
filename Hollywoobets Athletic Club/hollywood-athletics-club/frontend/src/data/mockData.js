export const athlete = {
  name: 'Anele Mkhize',
  email: 'anele.mkhize@hollywoodathletics.club',
  memberSince: 'January 2024',
  location: 'Durban, South Africa',
  stravaConnected: true,
  avatarInitials: 'AM',
};

export const activities = [
  {
    id: 1,
    name: 'Morning Run',
    date: 'March 12, 2026',
    distance: 8.5,
    duration: '42:18',
    pace: '4:59/km',
    elevation: '86 m',
    points: 85,
    type: 'Road',
  },
  {
    id: 2,
    name: 'Coastal Tempo',
    date: 'March 10, 2026',
    distance: 11.2,
    duration: '54:52',
    pace: '4:54/km',
    elevation: '112 m',
    points: 112,
    type: 'Tempo',
  },
  {
    id: 3,
    name: 'Track Intervals',
    date: 'March 8, 2026',
    distance: 6.4,
    duration: '29:36',
    pace: '4:37/km',
    elevation: '21 m',
    points: 64,
    type: 'Speed',
  },
  {
    id: 4,
    name: 'Club Long Run',
    date: 'March 5, 2026',
    distance: 18.6,
    duration: '1:38:44',
    pace: '5:19/km',
    elevation: '224 m',
    points: 186,
    type: 'Long',
  },
  {
    id: 5,
    name: 'Recovery Jog',
    date: 'March 3, 2026',
    distance: 5.8,
    duration: '33:22',
    pace: '5:45/km',
    elevation: '42 m',
    points: 58,
    type: 'Easy',
  },
  {
    id: 6,
    name: 'Hill Repeats',
    date: 'February 28, 2026',
    distance: 9.1,
    duration: '49:08',
    pace: '5:24/km',
    elevation: '318 m',
    points: 91,
    type: 'Hills',
  },
  {
    id: 7,
    name: 'Sunrise 10K',
    date: 'February 25, 2026',
    distance: 10,
    duration: '49:42',
    pace: '4:58/km',
    elevation: '75 m',
    points: 100,
    type: 'Road',
  },
  {
    id: 8,
    name: 'Easy Base Run',
    date: 'February 22, 2026',
    distance: 7.3,
    duration: '40:31',
    pace: '5:33/km',
    elevation: '53 m',
    points: 73,
    type: 'Easy',
  },
];

export const achievements = [
  {
    id: 1,
    title: '100 km Club',
    description: 'Logged more than 100 km this season.',
    progress: 100,
    tier: 'Gold',
  },
  {
    id: 2,
    title: 'Consistency Builder',
    description: 'Completed runs in three consecutive weeks.',
    progress: 100,
    tier: 'Silver',
  },
  {
    id: 3,
    title: 'Hill Hunter',
    description: 'Climbed 1,000 m across recent sessions.',
    progress: 74,
    tier: 'Bronze',
  },
];

export const dashboardStats = {
  totalDistance: '213.8 km',
  runsThisMonth: 14,
  currentStreak: '6 days',
  totalPoints: 2138,
};

export const profileStats = {
  numberOfRuns: 42,
  totalDistance: '213.8 km',
  totalPoints: 2138,
  totalActivities: 47,
  averageDistance: '5.1 km',
  currentStreak: '6 days',
  achievementStats: {
    earned: 9,
    inProgress: 4,
    gold: 3,
    silver: 4,
    bronze: 2,
  },
};

export const monthlyDistanceData = [
  { month: 'Oct', distance: 86 },
  { month: 'Nov', distance: 104 },
  { month: 'Dec', distance: 91 },
  { month: 'Jan', distance: 128 },
  { month: 'Feb', distance: 146 },
  { month: 'Mar', distance: 68 },
];

export const paceTrendData = [
  { week: 'W1', pace: 5.42 },
  { week: 'W2', pace: 5.34 },
  { week: 'W3', pace: 5.21 },
  { week: 'W4', pace: 5.16 },
  { week: 'W5', pace: 5.08 },
  { week: 'W6', pace: 4.98 },
];

export const activityCountData = [
  { month: 'Oct', count: 12 },
  { month: 'Nov', count: 15 },
  { month: 'Dec', count: 13 },
  { month: 'Jan', count: 18 },
  { month: 'Feb', count: 19 },
  { month: 'Mar', count: 14 },
];
