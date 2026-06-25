function Card({ card, isFlipped, onClick, disabled }) {
  return (
    <button className={`memory-card ${isFlipped ? 'flipped' : ''}`} onClick={onClick} disabled={disabled}>
      <div className="card-face card-front">?</div>
      <div className="card-face card-back">{card.symbol}</div>
    </button>
  );
}

export default Card;
