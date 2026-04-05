import React, { useState } from 'react';
import useConceptMapStore from '../hooks/useConceptMap';

import useConceptMap from '../hooks/useConceptMap';

const EXAMPLE_TOPICS = [
  'Photosynthesis',
  'Machine Learning',
  'World War II',
  'Blockchain Technology',
  'Human Immune System',
  'Newton\'s Laws of Motion',
];

export default function GeneratePanel({ onGenerated }) {
  const [tab, setTab] = useState('text'); // 'text' | 'topic'
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const { generating, generateMap } = useConceptMap();

  const handleGenerate = async () => {
    if (!text.trim() && !topic.trim()) return;
    try {
      const result = await generateMap({
        text: tab === 'text' ? text : '',
        topic: tab === 'topic' ? topic : '',
        userId: localStorage.getItem('userId') || 'guest',
      });
      onGenerated && onGenerated(result);
      setText('');
      setTopic('');
    } catch (err) {
      // toast shown by store
    }
  };

  return (
    <div className="gen-panel">
      <div className="gen-panel__header">
        <div className="gen-panel__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h3 className="gen-panel__title">Concept Map Generator</h3>
          <p className="gen-panel__subtitle">AI-powered knowledge visualization</p>
        </div>
      </div>

      <div className="gen-panel__tabs">
        <button className={`tab-btn ${tab === 'text' ? 'active' : ''}`} onClick={() => setTab('text')}>
          Paste Text
        </button>
        <button className={`tab-btn ${tab === 'topic' ? 'active' : ''}`} onClick={() => setTab('topic')}>
          By Topic
        </button>
      </div>

      {tab === 'text' ? (
        <div className="gen-panel__input-group">
          <label className="input-label">Study Material</label>
          <textarea
            className="gen-textarea"
            placeholder="Paste your notes, textbook content, or any study material here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
          />
          <span className="char-count">{text.length} chars</span>
        </div>
      ) : (
        <div className="gen-panel__input-group">
          <label className="input-label">Topic or Subject</label>
          <input
            className="gen-input"
            type="text"
            placeholder="e.g. Photosynthesis, Machine Learning..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <div className="example-topics">
            <span className="example-label">Try:</span>
            {EXAMPLE_TOPICS.map((t) => (
              <button key={t} className="example-chip" onClick={() => setTopic(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        className={`gen-btn ${generating ? 'loading' : ''}`}
        onClick={handleGenerate}
        disabled={generating || (!text.trim() && !topic.trim())}
      >
        {generating ? (
          <>
            <span className="spinner" />
            Generating Map...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Generate Concept Map
          </>
        )}
      </button>

      <div className="gen-panel__info">
        <div className="info-row">
          <span className="info-dot" style={{ background: '#5B4EE8' }} />
          <span>Core concept</span>
        </div>
        <div className="info-row">
          <span className="info-dot" style={{ background: '#1D9E75' }} />
          <span>Inputs / Requirements</span>
        </div>
        <div className="info-row">
          <span className="info-dot" style={{ background: '#EF9F27' }} />
          <span>Outputs / Results</span>
        </div>
        <div className="info-row">
          <span className="info-dot" style={{ background: '#3B8BD4' }} />
          <span>Processes</span>
        </div>
        <div className="info-row">
          <span className="info-dot" style={{ background: '#D4537E' }} />
          <span>Byproducts</span>
        </div>
        <div className="info-row">
          <span className="info-dot" style={{ background: '#888780' }} />
          <span>General concepts</span>
        </div>
      </div>
    </div>
  );
}
