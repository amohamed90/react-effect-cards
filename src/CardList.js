import React, {useState, useEffect, useRef} from 'react';
import Card from './Card';
import axios from 'axios';

function CardList() {

  const timerId = useRef();
  const [cards, setCards] = useState([]);
  const [deckId, setDeckId] = useState("");

  useEffect(() => {
    async function fetchDeckId() {
      const deckResp = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      setDeckId(deckResp.data.deck_id);
    }
    fetchDeckId();
  }, []);


  const addCard = async () => {
    const cardResp = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/`
    );
    let card = cardResp.data.cards[0];
    if (card) {
      setCards(oldCard => [...oldCard, card]);
    } else {
      clearInterval(timerId.current);
      timerId.current = null;
    }
  }

  const toggleDrawing = () => {
    if(!timerId.current) {
      timerId.current = setInterval(() => {
        addCard();
      }, 300);
    } else {
      clearInterval(timerId.current);
      timerId.current = null;
    }
  }

  const button = <button onClick={toggleDrawing}>ToggleDraw</button>;
  const noCards = <p>No remaining cards</p>;

  return (
    <div className="CardList">
      {cards.length < 52 ? button : noCards }
      <div>
        {cards.map(card => <Card key={card.code} cardImg={card.image} />)}
        {/* {cards.length > 1 ? <img src={cards[cards.length - 1].image} /> : null} */}
      </div>
    </div>
  );
}

export default CardList;