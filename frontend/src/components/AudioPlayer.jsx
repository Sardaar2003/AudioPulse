import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, FastForward, Rewind } from 'lucide-react';

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const AudioPlayer = forwardRef(({ audioUrl, title, onTimeUpdate }, ref) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Expose seekTo function to parent components (Proof table & Transcript viewer)
  useImperativeHandle(ref, () => ({
    seekTo: (seconds) => {
      if (audioRef.current) {
        audioRef.current.currentTime = seconds;
        setCurrentTime(seconds);
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play();
        setIsPlaying(true);
      }
    },
    play: () => {
      if (audioRef.current) {
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play();
        setIsPlaying(true);
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    },
  }));

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const skipTime = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (onTimeUpdate) onTimeUpdate(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            audioRef.current.playbackRate = playbackSpeed;
          }
        }}
        onEnded={() => setIsPlaying(false)}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
            Acoustic Playback Engine
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {title || 'Audio Stream'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          <span>{formatTime(currentTime)}</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Seek Range Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.01"
          value={currentTime}
          onChange={handleSeek}
          style={{
            width: '100%',
            height: '6px',
            accentColor: 'var(--accent-primary)',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Control Buttons & Playback Speed */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => skipTime(-5)} className="btn-secondary" style={{ padding: '0.5rem' }} title="Rewind 5s">
            <Rewind size={16} />
          </button>

          <button
            onClick={togglePlay}
            className="btn-primary"
            style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0 }}
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: '3px' }} />}
          </button>

          <button onClick={() => skipTime(5)} className="btn-secondary" style={{ padding: '0.5rem' }} title="Forward 5s">
            <FastForward size={16} />
          </button>
        </div>

        {/* Playback Speed Selector Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(0, 0, 0, 0.25)', padding: '3px 6px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', marginLeft: '0.3rem', marginRight: '0.2rem', textTransform: 'uppercase' }}>
            Speed:
          </span>
          {[0.5, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => handleSpeedChange(speed)}
              style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '12px',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: playbackSpeed === speed ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'transparent',
                color: playbackSpeed === speed ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: playbackSpeed === speed ? '0 2px 8px var(--accent-glow)' : 'none',
              }}
              title={`Set playback speed to ${speed}x`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Volume Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={toggleMute} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'transparent' }}>
            {isMuted || volume === 0 ? <VolumeX size={18} style={{ color: 'var(--danger)' }} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            style={{ width: '80px', accentColor: 'var(--accent-secondary)', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
});

export default AudioPlayer;
