import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './SceneForm.css';

const CATEGORIES = ['violence', 'nudity', 'profanity', 'gore', 'drugs'];
const SEVERITIES = ['mild', 'moderate', 'severe'];

function SceneForm({ movie, onClose, onSuccess }) {
  const [form, setForm] = useState({
    season:      '',
    episode:     '',
    start_time:  '',
    end_time:    '',
    category:    '',
    severity:    '',
    description: '',
  });

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // Update one field at a time
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Basic validation before saving
  function validate() {
    if (!form.start_time.trim()) return 'Start time is required.';
    if (!form.category)          return 'Please select a category.';
    if (!form.severity)          return 'Please select a severity.';
    if (!form.description.trim()) return 'Please add a short description.';

    // Time format check — must be HH:MM:SS
    const timePattern = /^\d{2}:\d{2}:\d{2}$/;
    if (!timePattern.test(form.start_time.trim())) {
      return 'Start time must be in HH:MM:SS format, e.g. 00:28:10';
    }
    if (form.end_time && !timePattern.test(form.end_time.trim())) {
      return 'End time must be in HH:MM:SS format, e.g. 00:28:14';
    }

    return null; // no errors
  }

  async function handleSubmit() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    const { error: saveError } = await supabase
      .from('content_flags')
      .insert([{
        movie_id:    movie.id,
        start_time:  form.start_time.trim(),
        end_time:    form.end_time.trim() || null,
        category:    form.category,
        severity:    form.severity,
        description: form.description.trim(),
        season:      form.season  ? parseInt(form.season)  : null,
        episode:     form.episode ? parseInt(form.episode) : null,
      }]);

    if (saveError) {
      setError('Something went wrong saving your scene. Please try again.');
      console.error(saveError);
    } else {
      onSuccess(); // tell the parent to refresh the scenes list
    }

    setLoading(false);
  }

  return (
    <>
      {/* Dark overlay behind the popup */}
      <div className="overlay" onClick={onClose} />

      {/* The popup itself */}
      <div className="modal">

        <div className="modal-header">
          <h2 className="modal-title">Suggest a Scene</h2>
          <p className="modal-subtitle">{movie.title}</p>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* TV show fields */}
          <p className="field-hint">
            Only fill in Season / Episode if this is a TV show.
          </p>
          <div className="field-row">
            <div className="field">
              <label>Season</label>
              <input
                type="number"
                name="season"
                placeholder="e.g. 1"
                value={form.season}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div className="field">
              <label>Episode</label>
              <input
                type="number"
                name="episode"
                placeholder="e.g. 3"
                value={form.episode}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          {/* Timestamps */}
          <div className="field-row">
            <div className="field">
              <label>Start time <span className="required">*</span></label>
              <input
                type="text"
                name="start_time"
                placeholder="00:28:10"
                value={form.start_time}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>End time</label>
              <input
                type="text"
                name="end_time"
                placeholder="00:28:14"
                value={form.end_time}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Category */}
          <div className="field">
            <label>Category <span className="required">*</span></label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select a category...</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div className="field">
            <label>Severity <span className="required">*</span></label>
            <div className="severity-buttons">
              {SEVERITIES.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`severity-btn severity-btn-${s} ${form.severity === s ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, severity: s })}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="field">
            <label>Description <span className="required">*</span></label>
            <textarea
              name="description"
              placeholder="Briefly describe what happens, e.g. 'Joker kills a man with a pencil — sudden and graphic'"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="form-error">{error}</div>
          )}

        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Submit Scene'}
          </button>
        </div>

      </div>
    </>
  );
}

export default SceneForm;