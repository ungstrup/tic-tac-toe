function Gameboard() {
  const rows = 3
  const columns = 3
  const board = []

  for (let i = 0; i < rows; i++) {
    board[i] = []
    for (let j = 0; j < columns; j++) {
      board[i].push(Square())
    }
  }
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

  return { getBoard, selectSquare, printBoard }
}

function Square() {
  let value = 0

  const addToken = (player) => {
    value = player
  }

  const getValue = () => value

  return { addToken, getValue }
}

const GameController = (function (playerOneName = 'Player One', playerTwoName = 'Player Two') {
  const board = Gameboard()

  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ]

  let playerTurn = players[0]

  const switchPlayerTurn = () => {
    playerTurn = playerTurn === players[0] ? players[1] : players[0]
  }

  const getPlayerTurn = () => playerTurn

  const printNewRound = () => {
    board.printBoard()
    console.log(`${getPlayerTurn().name}'s turn.`)
  }

  const playRound = (row, column) => {
    board.selectSquare(row, column, getPlayerTurn().token)

    const boardColumn = board.getBoard().filter((rows) => rows[column].getValue() === getPlayerTurn().token)
    const boardRow = board.getBoard()[row].every((index) => index.getValue() === getPlayerTurn().token)

    if (boardRow === true) {
      console.log(`${getPlayerTurn().name} wins!`)
    }
    if (boardColumn.length === 3) {
      console.log(`${getPlayerTurn().name} wins!`)
    }
    if (board.getBoard()[1][1].getValue() === getPlayerTurn().token) {
      if (board.getBoard()[0][0].getValue() === getPlayerTurn().token && board.getBoard()[2][2].getValue() === getPlayerTurn().token) {
        console.log(`${getPlayerTurn().name} wins!`)
      }
      if (board.getBoard()[0][2].getValue() === getPlayerTurn().token && board.getBoard()[2][0].getValue() === getPlayerTurn().token) {
        console.log(`${getPlayerTurn().name} wins!`)
      }
    }

    switchPlayerTurn()
    printNewRound()
  }

  printNewRound()

  return { playRound, getPlayerTurn, getBoard: board.getBoard }
})()

const displayController = (function () {
  const playerTurnText = document.querySelector('.player')
  const boardDiv = document.querySelector('.board')

  const screenUpdate = () => {
    boardDiv.textContent = ''

    const board = GameController.getBoard()
    const currentPlayer = GameController.getPlayerTurn()

    playerTurnText.textContent = `It is ${currentPlayer.name}'s turn`

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
  }
  function boardClick(e) {
    const selectColumn = e.target.dataset.column
    const selectRow = e.target.dataset.row

    GameController.playRound(selectRow, selectColumn)
    screenUpdate()
  }
  boardDiv.addEventListener('click', boardClick)

  screenUpdate()
})()

// GameController.playRound(0, 2)
// GameController.playRound(2, 1)
// GameController.playRound(1, 1)
// GameController.playRound(2, 2)
// GameController.playRound(2, 0)
// GameController.playRound(0, 1)
// GameController.playRound(0, 1)
