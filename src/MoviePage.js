import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './MoviePage.css';
import SceneForm from './SceneForm';

// Maps each category to a color class
const CATEGORY_STYLES = {
  violence:  { label: 'Violence',  className: 'badge-violence'  },
  nudity:    { label: 'Nudity',    className: 'badge-nudity'    },
  profanity: { label: 'Profanity', className: 'badge-profanity' },
  gore:      { label: 'Gore',      className: 'badge-gore'      },
  drugs:     { label: 'Drugs',     className: 'badge-drugs'     },
};

const SEVERITY_STYLES = {
  mild:     'severity-mild',
  moderate: 'severity-moderate',
  severe:   'severity-severe',
};

function MoviePage() {
  const { id } = useParams();       // grabs the movie ID from the URL
  const navigate = useNavigate();   // lets us go back to the previous page

  const [movie, setMovie]   = useState(null);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // category filter
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMovieAndScenes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchMovieAndScenes() {
    setLoading(true);

    // Fetch the movie details
    const { data: movieData, error: movieError } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();

    if (movieError) {
      console.error('Error fetching movie:', movieError);
      setLoading(false);
      return;
    }

    // Fetch all scenes for this movie, sorted by start_time
    const { data: scenesData, error: scenesError } = await supabase
      .from('content_flags')
      .select('*')
      .eq('movie_id', id)
      .order('start_time', { ascending: true });

    if (scenesError) {
      console.error('Error fetching scenes:', scenesError);
    }

    setMovie(movieData);
    setScenes(scenesData || []);
    setLoading(false);
  }

  // Filter scenes by category if a filter is active
  const visibleScenes = filter === 'all'
    ? scenes
    : scenes.filter(s => s.category === filter);

  // Count scenes per category for the summary badges
  const counts = scenes.reduce((acc, scene) => {
    acc[scene.category] = (acc[scene.category] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="page-loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="page-loading">
        <p>Movie not found.</p>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to search
        </button>
      </div>
    );
  }

  return (
    <div className="movie-page">

      <div className="page-top-bar">
  <button onClick={() => navigate('/')} className="back-button">
    ← Back to search
  </button>
  <button
    className="suggest-button"
    onClick={() => setShowForm(true)}
  >
    + Suggest a Scene
  </button>
</div>

{showForm && (
  <SceneForm
    movie={movie}
    onClose={() => setShowForm(false)}
    onSuccess={() => {
      setShowForm(false);
      fetchMovieAndScenes(); // refresh the list after submitting
    }}
  />
)}

      {/* ── Movie header ── */}
      <div className="movie-header">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="detail-poster"
          />
        ) : (
          <div className="detail-poster-placeholder">🎬</div>
        )}
        <div className="movie-header-info">
          <h1 className="detail-title">{movie.title}</h1>
          {movie.release_year && (
            <p className="detail-year">{movie.release_year}</p>
          )}

          {/* Summary counts */}
          <div className="summary-badges">
            {Object.entries(counts).map(([category, count]) => (
              <span
                key={category}
                className={`badge ${CATEGORY_STYLES[category]?.className}`}
              >
                {count} {CATEGORY_STYLES[category]?.label}
              </span>
            ))}
          </div>

          {scenes.length === 0 && (
            <p className="no-scenes">
              No scenes logged yet for this title.
            </p>
          )}
        </div>
      </div>

      {/* ── Filter buttons ── */}
      {scenes.length > 0 && (
        <div className="filter-bar">
          <span className="filter-label">Filter:</span>
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({scenes.length})
          </button>
          {Object.keys(counts).map(category => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {CATEGORY_STYLES[category]?.label} ({counts[category]})
            </button>
          ))}
        </div>
      )}

      {/* ── Scenes table ── */}
      {visibleScenes.length > 0 && (
        <div className="table-wrapper">
          <table className="scenes-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {visibleScenes.map(scene => (
                <tr key={scene.id}>

                  {/* Timestamp */}
                  <td className="td-time">
                    <span className="time-range">
                      {scene.start_time || '—'}
                      {scene.end_time && (
                        <> → {scene.end_time}</>
                      )}
                    </span>
                    {scene.season && (
                      <span className="episode-tag">
                        S{scene.season}E{scene.episode}
                      </span>
                    )}
                  </td>

                  {/* Category badge */}
                  <td className="td-category">
                    <span className={`badge ${CATEGORY_STYLES[scene.category]?.className}`}>
                      {CATEGORY_STYLES[scene.category]?.label || scene.category}
                    </span>
                  </td>

                  {/* Severity */}
                  <td className="td-severity">
                    <span className={`severity ${SEVERITY_STYLES[scene.severity]}`}>
                      {scene.severity || '—'}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="td-description">
                    {scene.description || '—'}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Filtered to zero results */}
      {visibleScenes.length === 0 && scenes.length > 0 && (
        <p className="status-message">
          No {filter} scenes logged for this title.
        </p>
      )}

    </div>
  );
}

export default MoviePage;