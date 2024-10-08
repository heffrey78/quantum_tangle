# Quantum Tangles Website

This is the website for the science fiction novel "Quantum Tangles" by Dr. Samantha Quark. The website features an interactive, quantum-themed design that showcases the novel's content and engages readers.

## Features

- Responsive design using Bootstrap
- Interactive table of contents with search functionality and collapsible chapter list
- Dynamic chapter loading with page-turning animations
- Character profiles with images
- Interactive world map
- Quantum particle animation
- Accessibility features for improved user experience

## Deployment Instructions for Google Cloud AppEngine

To deploy this website to Google Cloud AppEngine, follow these steps:

1. Install the Google Cloud SDK: https://cloud.google.com/sdk/docs/install

2. Authenticate with Google Cloud:
   ```
   gcloud auth login
   ```

3. Create a new project or select an existing project:
   ```
   gcloud projects create quantum-tangles-website
   gcloud config set project quantum-tangles-website
   ```

4. Create an `app.yaml` file in the website directory with the following content:
   ```yaml
   runtime: python37
   handlers:
   - url: /
     static_files: index.html
     upload: index.html
   - url: /(.*)
     static_files: \1
     upload: (.*)
   ```

5. Deploy the website:
   ```
   gcloud app deploy
   ```

6. Access your website at `https://quantum-tangles-website.appspot.com`

## Local Development

To run the website locally for development purposes:

1. Install a local web server, such as Python's `http.server`:
   ```
   python -m http.server 8000
   ```

2. Open a web browser and navigate to `http://localhost:8000`

## File Structure

- `index.html`: Main HTML file
- `styles.css`: CSS styles, including quantum theme
- `script.js`: JavaScript for interactivity and dynamic content loading
- `characters.json`: Character data
- `world_map.svg`: World map image
- `images/`: Directory containing character images and other visual assets
- `chapters/`: Directory containing chapter markdown files

## Customizing the Quantum Theme

The quantum theme colors and styles can be customized by modifying the CSS variables in the `:root` selector in `styles.css`. The main colors used are:

- `--primary-color`: Main theme color
- `--secondary-color`: Secondary theme color
- `--accent-color`: Accent color for highlights and interactive elements
- `--background-color`: Background color
- `--text-color`: Main text color

Note: The website uses Bootstrap 5 for its responsive design. When customizing, make sure to maintain compatibility with Bootstrap classes and components.

## Interactive Elements

1. Chapter List: A collapsible accordion containing all chapters, allowing users to easily navigate through the book.
2. Chapter Search: Users can search for specific chapters using the search input in the Table of Contents section.
3. Quantum Particle Animation: An interactive animation showcasing quantum particles is displayed on the home page.
4. World Map: The world map includes interactive markers for key locations in the story.
5. Character Profiles: Character information is dynamically loaded and displayed in card format.

## Accessibility Features

The website includes several accessibility features:

- Proper heading structure
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast color scheme
- "Skip to main content" link
- Responsive design for various devices and screen sizes

## Maintenance

To update the website content:

1. Edit the relevant files (HTML, CSS, JavaScript, or JSON)
2. If adding new chapters, place the markdown files in the `chapters/` directory
3. If adding new character images, place them in the `images/` directory
4. Re-deploy the website using the deployment instructions above

## Troubleshooting

If chapters are not loading correctly:
1. Ensure that the chapter markdown files are properly formatted and located in the `chapters/` directory.
2. Check the browser console for any JavaScript errors that might prevent chapter loading.
3. Verify that the `fetch` requests in `script.js` are using the correct path to access chapter files.

For any questions or issues, please contact the development team.