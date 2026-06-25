import Card from './Card';

function GameBoard({ cards, columns, onCardClick, selectedCardIds, matchedCardIds, isChecking }) {
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {cards.map((card) => {
        const isFlipped = selectedCardIds.includes(card.id) || matchedCardIds.includes(card.id);

        return (
          <Card
            key={card.id}
            card={card}
            isFlipped={isFlipped}
            disabled={isChecking || matchedCardIds.includes(card.id)}
            onClick={() => onCardClick(card.id)}
          />
        );
      })}
    </div>
  );
}

export default GameBoard;
