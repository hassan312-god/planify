# Planify

Planify is a responsive web application built with Next.js and Tailwind CSS for managing appointments.

## Features

- Calendar view using react-calendar
- Add, edit, and delete appointments
- Data persistence using localStorage
- Toast notifications for user feedback
- Light/dark mode toggle
- Fully responsive design (mobile & desktop)

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Calendar](https://github.com/wojtekmaj/react-calendar) - Calendar component
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications
- [date-fns](https://date-fns.org/) - Date manipulation library

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/planify.git
cd planify
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Use the following build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
   - **Node version:** `18`

The application is configured for static export and will work perfectly on Netlify.

### Manual Build

```bash
npm run build
```

This will generate a static export in the `out` directory that can be deployed to any static hosting service.

## Screenshots

(Screenshots to be added)

## Future Enhancements

- Implement authentication
- Add Supabase integration for data persistence
- Add drag and drop functionality for appointments
- Implement recurring appointments
- Add email/SMS reminders

## License

MIT
