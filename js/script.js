function Gameboard() {
  const rows = 3
  const columns = 3
  const board = []

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = []
      for (let j = 0; j < columns; j++) {
        board[i].push(Square())
      }
    }
  }

  resetBoard()
  const getBoard = () => board

  const selectSquare = (row, column, player) => {
    const availableSquare = board[row][column]
    if (availableSquare.getValue() !== 0) return
    board[row][column].addToken(player)
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((square) => square.getValue()))
    console.log(boardWithCellValues)
  }

  return { getBoard, selectSquare, printBoard, resetBoard }
}

function Square() {
  let value = 0

  const addToken = (player) => {
    value = player
  }

  const getValue = () => value

  return { addToken, getValue }
}

const GameController = (function () {
  const board = Gameboard()

  const players = [
    {
      name: '',
      token: 1,
    },
    {
      name: '',
      token: 2,
    },
  ]
  let gameWinner
  let gameTied
  let roundNumber = 0

  players.forEach((player) => (player.name = prompt(`Player ${player.token}, what is your name?`, `Player ${player.token}`)))

  let playerTurn = players[0]

  const switchPlayerTurn = () => {
    playerTurn = playerTurn === players[0] ? players[1] : players[0]
  }

  const getPlayerTurn = () => playerTurn

  const printNewRound = () => {
    board.printBoard()
    console.log(`${getPlayerTurn().name}'s turn.`)
  }
  const winGame = (board, row, column, player) => {
    const boardColumn = board.getBoard().filter((rows) => rows[column].getValue() === player.token)
    const boardRow = board.getBoard()[row].every((index) => index.getValue() === player.token)
    if (boardRow === true) {
      console.log('wins')
      return player.name
    }
    if (boardColumn.length === 3) {
      console.log('wins')
      return player.name
    }
    if (board.getBoard()[1][1].getValue() === player.token) {
      if (board.getBoard()[0][0].getValue() === player.token && board.getBoard()[2][2].getValue() === player.token) {
        console.log('wins')
        return player.name
      }
      if (board.getBoard()[0][2].getValue() === player.token && board.getBoard()[2][0].getValue() === player.token) {
        console.log('wins')
        return player.name
      }
    }
  }

  const getGameWinner = () => gameWinner
  const getGameTied = () => gameTied

  const playRound = (row, column) => {
    board.selectSquare(row, column, getPlayerTurn().token)

    if (winGame(board, row, column, getPlayerTurn()) === getPlayerTurn().name) {
      gameWinner = getPlayerTurn().name
    }
    if (roundNumber >= 8) {
      gameTied = true
    }
    roundNumber += 1
    console.log(roundNumber)
    switchPlayerTurn()
    printNewRound()
  }

  const resetGame = () => {
    board.resetBoard()
    gameWinner = ''
    gameTied = false
    roundNumber = 0
    playerTurn = players[0]
  }

  printNewRound()

  return { playRound, getPlayerTurn, getBoard: board.getBoard, resetGame, getGameWinner, getGameTied }
})()

const displayController = (function () {
  const playerTurnText = document.querySelector('.player')
  const boardDiv = document.querySelector('.board')
  const btnDiv = document.querySelector('.buttons')
  const resetButton = document.createElement('button')
  resetButton.textContent = 'Reset board'
  btnDiv.appendChild(resetButton)

  const screenUpdate = () => {
    boardDiv.textContent = ''
    const board = GameController.getBoard()
    const currentPlayer = GameController.getPlayerTurn()
    const playerWon = GameController.getGameWinner()
    const isTie = GameController.getGameTied()

    board.forEach((row, pIndex) => {
      row.forEach((square, index) => {
        const squareBtn = document.createElement('button')
        squareBtn.classList.add('square')

        squareBtn.dataset.column = index
        squareBtn.dataset.row = pIndex
        squareBtn.textContent = square.getValue()
        boardDiv.appendChild(squareBtn)
      })
    })

    if (playerWon) {
      playerTurnText.textContent = `${playerWon} wins!`
      return
    }
    if (isTie) {
      playerTurnText.textContent = `The game is a tie!`
      return
    }

    playerTurnText.textContent = `It is ${currentPlayer.name}'s turn`
  }
  function boardClick(e) {
    const selectColumn = e.target.dataset.column
    const selectRow = e.target.dataset.row
    if (e.target.textContent !== '0') return
    if (GameController.getGameWinner() || GameController.getGameTied()) return

    GameController.playRound(selectRow, selectColumn)
    screenUpdate()
  }
  boardDiv.addEventListener('click', boardClick)

  function resetBoardBtn() {
    GameController.resetGame()
    screenUpdate()
  }
  resetButton.addEventListener('click', resetBoardBtn)

  screenUpdate()
})()
