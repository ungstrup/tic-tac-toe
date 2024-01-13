const Gameboard = (function () {
  const rows = 3
  const columns = 3
  const board = []

  for (let i = 0; i < rows; i++) {
    board[i] = []
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell())
    }
  }
  const getBoard = () => board

  const selectCell = (row, column, player) => {
    const availableCell = board[row][column]
    if (availableCell.getValue() !== 0) return
    board[row][column].addToken(player)
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues)
  }

  return { getBoard, selectCell, printBoard }
})()

function Cell() {
  let value = 0

  const addToken = (player) => {
    value = player
  }

  const getValue = () => value

  return { addToken, getValue }
}

const GameController = (function (playerOneName = 'Player One', playerTwoName = 'Player Two') {
  // const board = Gameboard()

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
    Gameboard.printBoard()
    console.log(`${getPlayerTurn().name}'s turn.`)
  }

  const playRound = (row, column) => {
    Gameboard.selectCell(row, column, getPlayerTurn().token)

    const boardColumn = Gameboard.getBoard().filter((rows) => rows[column].getValue() === getPlayerTurn().token)
    const boardRow = Gameboard.getBoard()[row].every((index) => index.getValue() === getPlayerTurn().token)

    if (boardRow === true) {
      console.log(`${getPlayerTurn().name} wins!`)
    }
    if (boardColumn.length === 3) {
      console.log(`${getPlayerTurn().name} wins!`)
    }
    if (Gameboard.getBoard()[1][1].getValue() === getPlayerTurn().token) {
      if (Gameboard.getBoard()[0][0].getValue() === getPlayerTurn().token && Gameboard.getBoard()[2][2].getValue() === getPlayerTurn().token) {
        console.log(`${getPlayerTurn().name} wins!`)
      }
      if (Gameboard.getBoard()[0][2].getValue() === getPlayerTurn().token && Gameboard.getBoard()[2][0].getValue() === getPlayerTurn().token) {
        console.log(`${getPlayerTurn().name} wins!`)
      }
    }

    switchPlayerTurn()
    printNewRound()
  }

  printNewRound()

  return { playRound, getPlayerTurn }
})()

GameController.playRound(0, 2)
GameController.playRound(2, 1)
GameController.playRound(1, 1)
GameController.playRound(2, 2)
GameController.playRound(2, 0)
GameController.playRound(0, 1)
GameController.playRound(0, 1)
