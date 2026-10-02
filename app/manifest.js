export default function manifest() {
  return {
    name: 'Team Random - FYDP Workspace',
    short_name: 'Team Random',
    description: 'Academic team portal and project workspace for Team Random (UIU CSE)',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#10100f',
    theme_color: '#f36d22',
    icons: [
      {
        src: '/team-logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/team-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      }
    ]
  };
}
