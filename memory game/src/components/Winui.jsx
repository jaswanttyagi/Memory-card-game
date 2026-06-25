function WinModal({ isOpen, moves, time, difficulty, onRestart }) {
  if (!isOpen) return null;

  const formatTime = (value) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Congratulations! You Won</h2>
        <p>You completed the {difficulty} board.</p>
        <div className="modal-stats">
          <div>
            <span>Total Moves</span>
            <strong>{moves}</strong>
          </div>
          <div>
            <span>Final Time</span>
            <strong>{formatTime(time)}</strong>
          </div>
        </div>
        <button className="restart-btn" onClick={onRestart}>Play Again</button>
      </div>
    </div>
  );
}

export default WinModal;
