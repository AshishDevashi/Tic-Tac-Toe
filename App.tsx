import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';

const P1 = 'Player 1';
const P2 = 'Player 2';
const CROSS = 'X';
const ZERO = 'O';

const App = () => {
  const [Table, setTable] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);
  const [chance, setChance] = useState(P1);
  const [winner, setWinner] = useState('');
  const [winningCells, setWinningCells] = useState<number[][]>([]);

  const backgroundAnim = useRef(new Animated.Value(0)).current;

  // Animate background when turn changes
  useEffect(() => {
    Animated.timing(backgroundAnim, {
      toValue: chance === P1 ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [chance]);

  const bgColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0f2fe', '#dcfce7'],
  });

  const handlePress = (cellIndex: number, rowIndex: number) => {
    if (winner || Table[rowIndex][cellIndex] !== '') return;

    const copyOfTable = [...Table];
    copyOfTable[rowIndex][cellIndex] = chance === P1 ? CROSS : ZERO;
    setTable(copyOfTable);
    setChance(prev => (prev === P1 ? P2 : P1));
  };

  useEffect(() => {
    const checkWin = () => {
      // Row
      for (let i = 0; i < 3; i++) {
        if (
          Table[i][0] === Table[i][1] &&
          Table[i][0] === Table[i][2] &&
          Table[i][0] !== ''
        ) {
          setWinner(chance === P1 ? P2 : P1);
          setWinningCells([
            [i, 0],
            [i, 1],
            [i, 2],
          ]);
          return;
        }
      }
      // Column
      for (let i = 0; i < 3; i++) {
        if (
          Table[0][i] === Table[1][i] &&
          Table[0][i] === Table[2][i] &&
          Table[0][i] !== ''
        ) {
          setWinner(chance === P1 ? P2 : P1);
          setWinningCells([
            [0, i],
            [1, i],
            [2, i],
          ]);
          return;
        }
      }
      // Diagonal L->R
      if (
        Table[0][0] === Table[1][1] &&
        Table[0][0] === Table[2][2] &&
        Table[0][0] !== ''
      ) {
        setWinner(chance === P1 ? P2 : P1);
        setWinningCells([
          [0, 0],
          [1, 1],
          [2, 2],
        ]);
        return;
      }
      // Diagonal R->L
      if (
        Table[0][2] === Table[1][1] &&
        Table[0][2] === Table[2][0] &&
        Table[0][2] !== ''
      ) {
        setWinner(chance === P1 ? P2 : P1);
        setWinningCells([
          [0, 2],
          [1, 1],
          [2, 0],
        ]);
        return;
      }

      if (Table.flat().every(cell => cell !== '')) {
        setWinner('Draw');
      }
    };

    checkWin();
  }, [Table]);

  const handleReset = () => {
    setTable([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
    setChance(P1);
    setWinner('');
    setWinningCells([]);
  };

  const isWinningCell = (row: number, col: number) =>
    winningCells.some(([r, c]) => r === row && c === col);

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Text style={styles.turnText}>
        {winner ? '' : `${chance}'s Turn`}
      </Text>

      <View style={styles.board}>
        {Table.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => {
              const scaleAnim = useRef(new Animated.Value(0)).current;

              useEffect(() => {
                if (cell !== '') {
                  Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 4,
                  }).start();
                }
              }, [cell]);

              return (
                <Pressable
                  key={colIndex}
                  onPress={() => handlePress(colIndex, rowIndex)}
                  style={[
                    styles.cell,
                    isWinningCell(rowIndex, colIndex) && styles.winningCell,
                  ]}
                >
                  <Animated.Text
                    style={[
                      styles.cellText,
                      {
                        transform: [{ scale: scaleAnim }],
                      },
                    ]}
                  >
                    {cell}
                  </Animated.Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {winner && (
        <View style={styles.resultContainer}>
          <Text style={styles.winnerText}>
            {winner === 'Draw' ? 'Game is a Draw!' : `Winner: ${winner}`}
          </Text>
          <Pressable onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Play Again</Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  turnText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#1f2937',
  },
  board: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    elevation: 3,
  },
  cellText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1f2937',
  },
  winningCell: {
    backgroundColor: '#facc15', // yellow highlight
  },
  resultContainer: {
    alignItems: 'center',
  },
  winnerText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#10b981',
  },
  resetButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;



// niraj@fitistan.com