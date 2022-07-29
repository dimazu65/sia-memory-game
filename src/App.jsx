import { useState, useEffect, useRef } from 'react'
import './App.css'
import Board from './components/Board'

const cardImages = [
	{ src: '/img/m1_0.png', matched: false },
	{ src: '/img/m2_0.png', matched: false },
	{ src: '/img/m3_0.png', matched: false },
	{ src: '/img/m4_0.png', matched: false },
	{ src: '/img/m1_1.png', matched: false },
	{ src: '/img/m2_1.png', matched: false },
	{ src: '/img/m3_1.png', matched: false },
	{ src: '/img/m4_1.png', matched: false },
	{ src: '/img/m1_2.png', matched: false },
	{ src: '/img/m2_2.png', matched: false },
	{ src: '/img/m3_2.png', matched: false },
	{ src: '/img/m4_2.png', matched: false },

	/* { src: '/img/princess2.png', matched: false },
	{ src: '/img/princess3.png', matched: false },
	{ src: '/img/princess4.png', matched: false },
	{ src: '/img/princess5.png', matched: false },
	{ src: '/img/princess6.png', matched: false },
	{ src: '/img/princess7.png', matched: false },
	{ src: '/img/princess8.png', matched: false }
 */
]

function App() {
	
	const timerId = useRef()
	

	const [cards, setCards] = useState([])
	const [turns, setTurns] = useState(0)
	const [choiceOne, setChoiceOne] = useState(null)
	const [choiceTwo, setChoiceTwo] = useState(null)
	const [disabled, setDisabled] = useState(false)
	// Matched cards count : correct flipped cards
	const [matchedCardsCount, setMatchedCardsCount] = useState(0)
	// Timer : calculate time passed for match
	const [seconds, setSeconds] = useState(0)
	const [firstClick, setFirstClick] = useState(true)

	// shuffle cards for new game
	const shuffleCards = () => {
		const selected = cardImages.sort(() => 0.5 - Math.random()).slice(0,6);
		const shuffledCards = [...selected, ...selected]
			.sort(() => Math.random() - 0.5)
			.map(card => ({ ...card, id: Math.random() }))

		setChoiceOne(null)
		setChoiceTwo(null)
		setCards(shuffledCards)
		setTurns(0)
	}

	// handle when single card get clicked
	const handleChoice = card => {
		// If first time user click card, start timer
		if (firstClick) startTimer()
		setFirstClick(false)
		
		choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
	}

	// compare 2 selected cards
	useEffect(() => {
		if (choiceOne && choiceTwo) {
			setDisabled(true)
			if (choiceOne.src === choiceTwo.src) {
				setCards(prevCards => {
					return prevCards.map(card => {
						if (card.src === choiceOne.src) {
							return { ...card, matched: true }
						} else {
							return card
						}
					})
				})
				setMatchedCardsCount(prevCount => prevCount + 1)
				
				resetTurn()
			} else {
				setTimeout(() => resetTurn(), 1000)
			}
		}
	}, [choiceOne, choiceTwo])

	useEffect(()=>{
		if (matchedCardsCount === cards.length / 2) {
			stopTimer()
			console.log(matchedCardsCount)	
		}
		
	},[cards.length, matchedCardsCount])
	
	// reset choices & increase turn
	const resetTurn = () => {
		setChoiceOne(null)
		setChoiceTwo(null)
		setTurns(prevTurns => prevTurns + 1)
		setDisabled(false)
	}

	// start new game automatically when app mounts
	useEffect(() => {
		shuffleCards()
	}, [])

	const startNewGame = () => {
		shuffleCards()
		
		setMatchedCardsCount(0)
		
		setSeconds(0)
		
		startTimer()
	}

	const startTimer = () => {
		timerId.current = setInterval(() => {
			// renders.current++
			setSeconds(prev => prev + 1)
		}, 1000)
	}

	const stopTimer = () => {
		clearInterval(timerId.current)
		timerId.current = 0
	}

	return (
		<div className='App'>
			<header>
				<h3>
					{' '}
					<i className='fa-solid fa-chess-board'></i> Sia Match
				</h3>
				<div className='btns'>
					<button onClick={startNewGame}>New Game</button>{' '}
					
				</div>
				<div className='timer'>
					<i className='fa-regular fa-clock'></i> Timer:{' '}
					{seconds === 0 ? '0:00' : seconds}
				</div>
			</header>

			<div className='container'>
				
				<Board
					cards={cards}
					choiceOne={choiceOne}
					choiceTwo={choiceTwo}
					handleChoice={handleChoice}
					disabled={disabled}
				/>

				{/* <p>Turns: {turns}</p> */}
			</div>
		</div>
	)
}

export default App
