# 🎬 MovieX - Modern Streaming Platform UI

A beautifully designed movie and TV show streaming platform built with React, featuring a modern, responsive interface inspired by Netflix and other premium streaming services.

## ✨ Features

### 🎨 Modern UI Design
- **Premium Streaming Look**: Sleek dark theme with gradient accents matching Moov/Monsters Inc design
- **Glassmorphism Effects**: Modern frosted glass navbar and interactive elements
- **Smooth Animations**: Fade-in, slide-in, and interactive hover effects throughout
- **Responsive Design**: Mobile-first approach with perfect scaling on all devices

### 🎥 Content Discovery
- **Hero Banner**: Dynamic featured content with movie backdrop and search functionality
- **Genre Filtering**: Browse content by categories (Action, Adventure, Animation, Horror, Documentary, Romance, Kids)
- **Trending Section**: Movies and TV shows sorted by popularity
- **What's Popular**: Current popular content with Movies/TV Shows toggle
- **Top Rated**: Highest-rated movies and TV series
- **Infinite Scroll**: Seamless content loading in Explore pages

### 🔍 Search & Navigation
- **Smart Search**: Find movies and TV shows with autocomplete
- **Multi-page Navigation**: Home, Movies, Series, Kids sections
- **Detailed Pages**: Individual movie/show pages with ratings, genres, cast, recommendations
- **Search Results**: Dedicated search results page with infinite scroll

### 📊 Genre Filtering
- **Smart Genre System**: Separate genre IDs for movies and TV shows
- **Real-time Updates**: Instant content refresh when changing genres
- **TV Series Support**: Proper TV-specific genre mappings
- **Persistent State**: Genre selection maintained across sections

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+
- **Build Tool**: Vite (Fast development and production builds)
- **Styling**: SCSS with CSS variables and mixins
- **State Management**: Redux (for API configuration)
- **Routing**: React Router v6
- **API**: TMDB (The Movie Database)
- **HTTP Client**: Axios
- **Lazy Loading**: react-lazy-load-image-component
- **Infinite Scroll**: react-infinite-scroll-component
- **UI Components**: react-select (for dropdowns), react-icons
- **Animations**: CSS Keyframes

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn**
- **Git**

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/MovieX.git
   cd MovieX
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Get TMDB API Key**
   - Visit [TMDB Website](https://www.themoviedb.org/)
   - Sign up for a free account
   - Go to Settings → API → Create API Key
   - Copy your API key

4. **Create Environment Variables**
   - Create a `.env` file in the project root:
   ```bash
   VITE_API_KEY=your_tmdb_api_key_here
   VITE_API_URL=https://api.themoviedb.org/3
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at: **http://localhost:5173**

### Building for Production

```bash
npm run build
# or
yarn build
```

Production files will be generated in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 📁 Project Structure

```
MovieX/
├── src/
│   ├── assets/              # Images, logos, and static files
│   ├── components/          # Reusable UI components
│   │   ├── carousel/        # Movie carousel slider
│   │   ├── circleRating/    # Rating badge component
│   │   ├── contentWrapper/  # Layout wrapper
│   │   ├── footer/          # Footer section
│   │   ├── genres/          # Genre tags display
│   │   ├── header/          # Navigation navbar
│   │   ├── lazyLoadImage/   # Lazy image loader
│   │   ├── movieCard/       # Individual movie/show card
│   │   ├── spinner/         # Loading spinner
│   │   ├── switchTabs/      # Tab switcher (Day/Week, Movies/TV)
│   │   ├── videoPopup/      # Video player modal
│   │   └── categoryPills/   # Genre filter buttons
│   ├── hooks/
│   │   └── useFetch.jsx     # Custom fetch hook
│   ├── pages/               # Full page components
│   │   ├── 404/             # Not found page
│   │   ├── details/         # Movie/show details page
│   │   ├── explore/         # Browse movies/TV shows
│   │   ├── home/            # Home page
│   │   │   ├── heroBanner/
│   │   │   ├── trending/
│   │   │   ├── popular/
│   │   │   └── topRated/
│   │   └── searchResult/    # Search results page
│   ├── store/               # Redux store
│   │   ├── homeSlice.js     # Redux slice for home state
│   │   └── store.js         # Store configuration
│   ├── utils/
│   │   └── api.js           # API utility functions
│   ├── App.jsx              # Main app component
│   ├── App.css              # Global styles
│   ├── index.scss           # Global SCSS (colors, animations, variables)
│   ├── main.jsx             # Entry point
│   └── mixins.scss          # SCSS mixins (responsive)
├── public/                  # Public assets
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── index.html               # HTML template
└── README.md                # This file
```

## 🎨 Design System

### Color Palette
- **Background Primary**: `#0E0F13` (Deep black)
- **Background Secondary**: `#1A1D24` (Dark gray)
- **Accent Primary**: `#E54982` (Vibrant pink)
- **Accent Secondary**: `#FF6B9D` (Light pink)
- **Text Primary**: `#FFFFFF` (White)
- **Text Secondary**: `#9DA0A8` (Light gray)
- **Border Color**: `rgba(255, 255, 255, 0.1)` (Subtle border)

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet/Desktop**: ≥ 768px (`md` breakpoint)

### Animations
- **fadeInUp**: Bottom-to-top fade in
- **slideInLeft**: Left-to-right slide
- **glow**: Glowing effect for hover states
- **pulse**: Pulsing animation
- **shimmer**: Loading skeleton effect

## 🔑 Key Features Explanation

### Genre Filtering System

The app uses TMDB's genre system with **separate genre IDs for movies and TV shows**:

**Movie Genres:**
- Action: 28, Adventure: 12, Animation: 16, Horror: 27, Documentary: 99, Romance: 10749, Kids: 10751

**TV Show Genres:**
- Action & Adventure: 10759, Animation: 16, Documentary: 99, Kids: 10762

When you select a genre:
1. The selected genre is converted to the appropriate ID
2. All sections (Trending, Popular, Top Rated) refetch with the genre filter
3. Content updates in real-time
4. Selecting "All" removes the genre filter

### Smart Tab Switching

- **Trending**: Movies/TV Shows with Day/Week options
- **What's Popular**: Movies/TV Shows toggle
- **Top Rated**: Movies/TV Shows toggle
- **Explore**: Full browse with genre and sort filters

### Infinite Scroll

The Explore pages use infinite scroll to load more content:
- Automatically loads next page when you scroll near the bottom
- Shows loading spinner while fetching
- Prevents duplicate content
- Works with genre and sort filters

## 🔗 API Integration

### TMDB API Endpoints Used

- `GET /discover/movie` - Browse movies with filters
- `GET /discover/tv` - Browse TV shows with filters
- `GET /trending/movie/{time_window}` - Trending movies
- `GET /movie/popular` - Popular movies
- `GET /tv/popular` - Popular TV shows
- `GET /movie/top_rated` - Top-rated movies
- `GET /tv/top_rated` - Top-rated TV shows
- `GET /genre/movie/list` - Movie genres
- `GET /genre/tv/list` - TV show genres
- `GET /movie/{id}` - Movie details
- `GET /tv/{id}` - TV show details
- `GET /movie/{id}/credits` - Movie cast
- `GET /tv/{id}/credits` - TV show cast
- `GET /movie/{id}/similar` - Similar movies
- `GET /tv/{id}/similar` - Similar TV shows
- `GET /search/movie` - Search movies
- `GET /search/tv` - Search TV shows

## 📱 Responsive Design

The app is fully responsive with:
- **Mobile**: Single column layout, optimized touch targets, full-width elements
- **Tablet**: 2-column grid for content
- **Desktop**: Multi-column layout with max-width container

All components scale beautifully across devices.

## 🚨 Troubleshooting

### API Key Issues
- Ensure your TMDB API key is correct in `.env`
- Check that the API key has read permissions
- Verify the API endpoint URL is correct

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist && npm run build`

### SCSS Compilation Errors
- Ensure SCSS syntax is correct (proper nesting and braces)
- Clear `.vite` cache folder
- Restart the development server

### No Data Displaying
- Check browser console for API errors
- Verify your TMDB API key is valid
- Check network tab to see API responses
- Ensure you're not rate limited (TMDB has request limits)

## 📖 Usage Examples

### Browse by Genre
1. Go to Home page
2. Click any genre button (Action, Adventure, etc.)
3. All sections update to show only that genre

### Search for Content
1. Click search icon in navbar
2. Type movie or TV show name
3. Press Enter or click Search
4. View filtered results with infinite scroll

### View Details
1. Click on any movie/show card
2. See full details: plot, cast, rating, genres
3. View similar recommendations
4. Watch trailers (if available)

### Toggle Between Movies & TV
1. Click "Movies" or "TV Shows" tab in any section
2. Content switches instantly
3. Genre filter applies to selected type

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TMDB API Docs](https://developer.themoviedb.org)
- [Redux Documentation](https://redux.js.org)
- [React Router Docs](https://reactrouter.com)
- [SCSS Documentation](https://sass-lang.com)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions:
1. Check the [Issues](https://github.com/yourusername/MovieX/issues) page
2. Create a new issue with detailed description
3. Include screenshots if applicable

## 🎉 Acknowledgments

- TMDB for providing the comprehensive movie and TV show database
- React and Vite communities for excellent tools
- Design inspiration from Netflix, Disney+, and Moov

---

**Happy streaming! 🍿🎬**

Built with ❤️ for movie and TV show enthusiasts