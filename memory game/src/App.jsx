import { useEffect, useState } from "react";
import GameBoard from "./components/GameBoard";
import Winui from './components/Winui';

// let decide diffuculties
const dificulties = {
    easy : {label : 'Easy' , pairs : 8 , columns : 4},
    medium : {label : 'medium' , pairs :12 , columns : 6},
    hard : {label : 'Hard' , pairs :18 , columns : 6},
};

// let take the emoji symobl which suffle behind the card
const symbols = [
    '🍒', '🍋', '🍇', '🍉', '🍍', '🥝', '🍓', '🍎',
  '🍊', '🥭', '🍑', '🍌', '🥑', '🫐', '🌟', '⚡',
  '💎', '🎯', '🦊', '🐼', '🐸', '🌈', '🌺', '☀️',
];

// shuffling logic
// here we not chnage the original array instead of its we copied the array so original array not get modified
const shufflecards = (arr)=>{
    const copied = [...arr];
    for(let i=copied.length-1 ; i>0; i-=1){
        const randIdx = Math.floor(Math.random() * (i+1));
        [copied[i] , copied[randIdx]] = [copied[randIdx] , copied[i]];
    }
    return copied;
}

// building the deck to shoow the emojis
const createDeck = (diff)=>{
    const pairCount = dificulties[diff].pairs;
    const selectedSymbols = symbols.slice(0, pairCount);    // using the spread 
    const deck = [...selectedSymbols , ...selectedSymbols].map((symbol ,index)=>({
       id: `${symbol}-${index}`,
        symbol,
        matched:false
    }));
    return shufflecards(deck);

};

function App(){
   const [diffculty , setdiffculty] = useState('easy');
   const [crads , setCards] = useState(()=>createDeck('easy'));
   const [selectedCards , setSelectedCards] = useState([]);
   // moves in intails will be zero
   const [moves , setMoves] = useState(0);
   const[elaspedTime , setElaspedTime] = useState(0);
   // this will show on ui is time is running or not 
   const[isTimeRunning , setIsTimeRunning] = useState(false);
   const[isChecking , setIsChecking] = useState(false);
   const[isGameWon , setIsgameWon] = useState(false);
   const[best , setbestScores] = useState({}); // we handle the local storage through the best score
   useEffect(()=>{
        // storing the bets score in local storage for the user
        // here we mark the score first time as best score 

        const savedScores = localStorage.getItem('memory-game-best-score');
        if(savedScores){
            setbestScores(JSON.parse(savedScores));
        }
   },[]);

   // if user create the best score than saved score then we are gonna to uodate the best score
   useEffect(()=>{
    localStorage.setItem('memory-game-best-score' , JSON.stringify(best));
   }, [best]); // only when best is changed

   useEffect(()=>{
    if(!isTimeRunning) return undefined;
    const timer = window.setInterval(()=>{
        setElaspedTime((prev)=>prev+1);
    },1000);
    return ()=>window.clearInterval(timer);
   } , [isTimeRunning]);

  // Check if every card is matched and show the win screen.
   useEffect(()=>{
    if(crads.length > 0 && crads.every((card)=>card.matched)){
        setIsTimeRunning(false);
        setIsgameWon(true);
        setbestScores((prev)=>{
            // best score is gonna to set on two things moves, and time taken
            const currbest = prev[diffculty];
            const newscore = {moves , time : elaspedTime};

            if(!currbest) return {...prev , [diffculty] : newscore};
            if(newscore.moves < currbest.moves || (newscore.moves === currbest.moves && newscore.time < currbest.time)){
                return {...prev , [diffculty] :newscore};
            }
            return prev;
        });
    }
   } , [crads , diffculty , elaspedTime , moves]);

   // new game
   const startnewGame = (nextDiffculty = diffculty)=>{
    setdiffculty(nextDiffculty);
    setCards(createDeck(nextDiffculty));
    setSelectedCards([]);
    setMoves(0);
    setElaspedTime(0);
    setIsTimeRunning(false);
    setIsChecking(false);
    setIsgameWon(false);
   };
     // Handle card clicks in a simple way: allow only two cards at a time

     const handleCardclick = (cardId)=>{
        if(isChecking || isGameWon) return;

        const clickedCard = crads.find((card)=>card.id === cardId);
        if(!clickedCard || clickedCard.matched) return;

        if(selectedCards.some((card) => card.id === cardId)) return;

        if(!isTimeRunning){
            setIsTimeRunning(true);
        }

        if(selectedCards.length === 0){
            setSelectedCards([clickedCard]);
            return;
        }

        const nextSelection = [...selectedCards, clickedCard];
        setSelectedCards(nextSelection);
        setMoves((prev)=>prev+1);
        setIsChecking(true);
        window.setTimeout(()=>{
            const [firstCard, secondCard] = nextSelection;
            if(firstCard.symbol === secondCard.symbol){
                setCards((prev)=>
                prev.map((card)=>
                card.id === firstCard.id || card.id === secondCard.id ? {
                    ...card , matched:true
                }:card));
            }
            setSelectedCards([]);
            setIsChecking(false);
        }, 700);
     };

     const formatTIme = (time)=>{
        const min = Math.floor(time/60);
        const sec = time%60;
        return `${min} : ${sec.toString().padStart(2 , '0')}`;
     };

     const currbest = best[diffculty];
     const columns = dificulties[diffculty].columns;
     return (
         <div className="app-shell">
              <div className="game-card">
                <header className="game-header">
                  <div>
                    <p className="eyebrow">React Memory Challenge</p>
                    <h1>Memory Match</h1>
                    <p className="subtitle">Find every pair before the timer runs away.</p>
                  </div>
        
                  <button className="restart-btn" onClick={() => startnewGame()}>
                    Restart Game
                  </button>
                </header>
        
                <section className="controls">
                  <div className="difficulty-group">
                    {Object.entries(dificulties).map(([key, level]) => (
                      <button
                        key={key}
                        className={`difficulty-btn ${diffculty === key ? 'active' : ''}`}
                        onClick={() => startnewGame(key)}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
        
                  <div className="stats-panel">
                    <div className="stat-box">
                      <span className="stat-label">Moves</span>
                      <strong>{moves}</strong>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Time</span>
                      <strong>{formatTIme(elaspedTime)}</strong>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Best</span>
                      <strong>
                        {currbest ? `${currbest.moves} moves • ${formatTIme(currbest.time)}` : '—'}
                      </strong>
                    </div>
                  </div>
                </section>
        
                <GameBoard
                  cards={crads}
                  columns={columns}
                  onCardClick={handleCardclick}
                  selectedCardIds={selectedCards.map((card) => card.id)}
                  matchedCardIds={crads.filter((card) => card.matched).map((card) => card.id)}
                  isChecking={isChecking}
                />
              </div>
        
              <Winui
                isOpen={isGameWon}
                moves={moves}
                time={elaspedTime}
                difficulty={dificulties[diffculty].label}
                onRestart={() => startnewGame()}
              />
            </div>
     );
}
export default App;