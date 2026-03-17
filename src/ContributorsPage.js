import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ContributorsPage.css';

const OPEN_ISSUES = [
  { number: 1, title: 'User accounts and login', difficulty: 'Medium', description: 'Allow users to sign up, log in, and have submissions tied to their account. Supabase Auth is already installed.', skills: ['React', 'Supabase Auth'] },
  { number: 2, title: 'Admin approval queue', difficulty: 'Medium', description: 'Before a submitted scene goes live, an admin should be able to approve or reject it. Needs a simple dashboard.', skills: ['React', 'Supabase'] },
  { number: 3, title: 'Add movies via search', difficulty: 'Easy', description: 'Right now movies are added manually. Integrate the free TMDB API so users can search for and add any movie automatically.', skills: ['React', 'REST API'] },
  { number: 4, title: 'Upvote and downvote scenes', difficulty: 'Easy', description: 'Let users vote on whether a scene report is accurate. Show the most-agreed-on scenes at the top.', skills: ['React', 'Supabase'] },
  { number: 5, title: 'Mobile-friendly design', difficulty: 'Easy', description: 'The site works on mobile but could look much better. Improve the layout for small screens.', skills: ['CSS'] },
  { number: 6, title: 'Skip timestamps like SponsorBlock', difficulty: 'Hard', description: 'A browser extension that reads CleanPlay data and shows a warning bar at flagged timestamps while watching on streaming sites.', skills: ['Browser Extension', 'JavaScript'] },
];

const DIFFICULTY_STYLES = {
  Easy: 'diff-easy',
  Medium: 'diff-medium',
  Hard: 'diff-hard',
};

function ContributorsPage() {
  const navigate = useNavigate();

  return (
    <div className="contrib-page">

      <button onClick={() => navigate('/')} className="back-button">
        Back to search
      </button>

      <div className="contrib-hero">
        <h1>Help Build CleanPlay</h1>
        <p className="contrib-subtitle">
          CleanPlay is an open-source project that helps families and sensitive
          viewers know what is in a movie before they watch it. We are looking for
          developers, designers, and movie fans to help us grow.
        </p>
        <div className="contrib-links">
          <a href="https://github.com/lemavodo/cleanplay" target="_blank" rel="noreferrer" className="btn-github">
            Star us on GitHub
          </a>
          <a href="https://github.com/lemavodo/cleanplay/issues" target="_blank" rel="noreferrer" className="btn-issues">
            View Open Issues
          </a>
        </div>
      </div>

      <div className="contrib-section">
        <h2>How to contribute</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Fork the repo</h3>
            <p>Click Fork on our GitHub page to get your own copy of the code.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Pick an issue</h3>
            <p>Choose any open issue below and leave a comment saying you are working on it.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Submit a pull request</h3>
            <p>Push your changes and open a PR. We review within 48 hours.</p>
          </div>
        </div>
      </div>

      <div className="contrib-section">
        <h2>Open issues</h2>
        <div className="issues-list">
          {OPEN_ISSUES.map(issue => (
            <div key={issue.number} className="issue-card">
              <div className="issue-header">
                <span className="issue-number">#{issue.number}</span>
                <h3 className="issue-title">{issue.title}</h3>
                <span className={`difficulty ${DIFFICULTY_STYLES[issue.difficulty]}`}>
                  {issue.difficulty}
                </span>
              </div>
              <p className="issue-description">{issue.description}</p>
              <div className="issue-skills">
                {issue.skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="contrib-footer">
        <p>Questions? Open a GitHub issue or reach out directly.</p>
        <p className="contrib-thank">Thanks for helping make movies safer to watch.</p>
      </div>

    </div>
  );
}

export default ContributorsPage;