# Assets

This folder contains static assets for the Presupuesto Familiar application.

## Structure

- **icons/**: Custom icons (currently using emojis, can be replaced with SVG icons)
- **avatars/**: User avatar images (for future implementation)

## Adding Custom Icons

If you want to replace emojis with custom icons:

1. Add SVG files to the `icons/` folder
2. Update the icon selector in `dashboard.html`
3. Modify the rendering logic in `envelope-system.js`

## Adding Avatars

For the kids mode, you can add fun avatar images:

1. Add PNG/SVG images to the `avatars/` folder
2. Implement avatar selection in the user profile
3. Display the avatar in the dashboard header
