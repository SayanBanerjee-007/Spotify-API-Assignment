export const root = (req, res) => {
	const apiRoutes = [
		{
			category: 'Authentication',
			routes: [
				{
					method: 'GET',
					path: '/auth/login',
					description: 'Initiate Spotify OAuth flow',
					requiresAuth: false,
					testable: false,
					isRedirect: true,
				},
				{
					method: 'GET',
					path: '/auth/callback',
					description: 'OAuth callback handler (automatic)',
					requiresAuth: false,
					testable: false,
				},
				{
					method: 'GET',
					path: '/auth/status',
					description: 'Check authentication status',
					requiresAuth: false,
					testable: true,
				},
			],
		},
		{
			category: 'Spotify Data',
			routes: [
				{
					method: 'GET',
					path: '/spotify',
					description: 'Get top 10 tracks and currently playing song',
					requiresAuth: true,
					testable: true,
				},
				{
					method: 'GET',
					path: '/spotify/top-tracks',
					description: 'Get your top tracks (limit: 1-50)',
					requiresAuth: true,
					testable: true,
					params: '?limit=10',
				},
				{
					method: 'GET',
					path: '/spotify/now-playing',
					description: 'Get currently playing track',
					requiresAuth: true,
					testable: true,
				},
			],
		},
		{
			category: 'Playback Control',
			routes: [
				{
					method: 'POST',
					path: '/spotify/play',
					description: 'Play a track (requires Spotify Premium)',
					requiresAuth: true,
					testable: true,
					body: { uri: 'spotify:track:TRACK_ID' },
				},
				{
					method: 'POST',
					path: '/spotify/stop',
					description: 'Pause playback (requires Spotify Premium)',
					requiresAuth: true,
					testable: true,
				},
			],
		},
	]

	res.render('index', {
		title: 'Spotify API Documentation',
		version: '1.0.0',
		apiRoutes,
	})
}
