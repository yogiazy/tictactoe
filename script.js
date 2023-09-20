let playerText = document.getElementById('plyText')
// let restartBtn = document.getElementById('btn-restart')
let boxes = Array.from(document.getElementsByClassName('box'))

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks')

const O_TEXT = "O"
const X_TEXT = "X"
let currentPlayer = X_TEXT
let spaces = Array(9).fill(null)

const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked))
}

function boxClicked(e) {
    const id = e.target.id

    if (!spaces[id] && currentPlayer === X_TEXT) {
        spaces[id] = currentPlayer
        e.target.innerText = currentPlayer

        if (playerHasWon() !== false) {
            playerText.innerHTML = `You Won!`
            let winning_blocks = playerHasWon()
            swalWithBootstrapButtons.fire({
                title: 'Congrats! You Won!',
                text: "Play again? Choose who will play first",
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'You',
                cancelButtonText: 'Azy',
                reverseButtons: true
            }).then((result) => {
                spaces.fill(null)
                boxes.forEach(box => {
                    box.innerText = ''
                    box.style.backgroundColor = ''
                })
                playerText.innerHTML = 'Can you beat Azy?'
                if (result.isConfirmed) {
                    currentPlayer = X_TEXT;
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    currentPlayer = O_TEXT;
                    setTimeout(makeBestMove, 500);
                }
            })

            winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator)
            return
        }

        if (spaces.every(space => space !== null)) {
            playerText.innerHTML = 'It\'s a draw!';
            swalWithBootstrapButtons.fire({
                title: 'It\'s a Draw!',
                text: "Play again? Choose who will play first",
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'You',
                cancelButtonText: 'Azy',
                reverseButtons: true
            }).then((result) => {
                spaces.fill(null)
                boxes.forEach(box => {
                    box.innerText = ''
                    box.style.backgroundColor = ''
                })
                playerText.innerHTML = 'Can you beat Azy?'
                if (result.isConfirmed) {
                    currentPlayer = X_TEXT;
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    currentPlayer = O_TEXT;
                    setTimeout(makeBestMove, 500);
                }
            })
            return
        }

        currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT

        // AI's turn
        setTimeout(makeBestMove, 500);
    }
}

function makeBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < spaces.length; i++) {
        if (spaces[i] == null) {
            spaces[i] = O_TEXT;
            let score = minimax(spaces, 0, false);
            spaces[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    spaces[move] = O_TEXT;
    boxes[move].innerText = O_TEXT;

    if (playerHasWon() !== false) {
        playerText.innerHTML = `Azy Won!`;
        let winning_blocks = playerHasWon();
        swalWithBootstrapButtons.fire({
            title: 'You Lose!',
            text: "Play again? Choose who will play first",
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'You',
            cancelButtonText: 'Azy',
            reverseButtons: true
        }).then((result) => {
            spaces.fill(null)
            boxes.forEach(box => {
                box.innerText = ''
                box.style.backgroundColor = ''
            })
            playerText.innerHTML = 'Can you beat Azy?'
            if (result.isConfirmed) {
                currentPlayer = X_TEXT;
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                currentPlayer = O_TEXT;
                setTimeout(makeBestMove, 500);
            }
        })

        winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);
        return;
    }

    if (spaces.every(space => space !== null)) {
        playerText.innerHTML = 'It\'s a draw!'
        swalWithBootstrapButtons.fire({
            title: 'It\'s a Draw!',
            text: "Choose who will play first",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'You',
            cancelButtonText: 'Azy',
            reverseButtons: true
        }).then((result) => {
            spaces.fill(null)
            boxes.forEach(box => {
                box.innerText = ''
                box.style.backgroundColor = ''
            })
            playerText.innerHTML = 'Can you beat Azy?'
            if (result.isConfirmed) {
                currentPlayer = X_TEXT;
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                currentPlayer = O_TEXT;
                setTimeout(makeBestMove, 500);
            }
        })
        return
    }

    currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;
}

function minimax(board, depth, isMaximizing) {
    if (playerHasWon() !== false) {
        return isMaximizing ? -1 : 1;
    } else if (spaces.every(space => space !== null)) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] == null) {
                board[i] = O_TEXT;
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] == null) {
                board[i] = X_TEXT;
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return [a, b, c]
        }
    }
    return false
}

startGame()

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
})

swalWithBootstrapButtons.fire({
    title: 'TIC TAC TOE!',
    text: "Hi! I'm Azy. Let's play Tic Tac Toe with me! Choose who will play first",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'You',
    cancelButtonText: 'Azy',
    reverseButtons: true
}).then((result) => {
    if (result.isConfirmed) {
        currentPlayer = X_TEXT;
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        currentPlayer = O_TEXT;
        setTimeout(makeBestMove, 500);
    }
})
