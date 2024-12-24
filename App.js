import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

export default function App() {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [winner, setWinner] = useState('');
  const [scaleAnim] = useState(new Animated.Value(1));

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/goal-sound.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.error('Error saat memutar suara:', error);
    }
  };

  const animateScore = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.4,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const addScore = (team) => {
    animateScore();
    if (team === 'A') {
      setScoreA((prev) => prev + 1);
      playSound();
    } else {
      setScoreB((prev) => prev + 1);
      playSound();
    }
  };

  const subtractScore = (team) => {
    if (team === 'A' && scoreA > 0) {
      setScoreA((prev) => prev - 1);
    } else if (team === 'B' && scoreB > 0) {
      setScoreB((prev) => prev - 1);
    }
  };

  const resetScores = () => {
    setScoreA(0);
    setScoreB(0);
    setModalVisible(false);
  };

  useEffect(() => {
    if (scoreA === 10) {
      setWinner('🔥 Tim A Berjaya! 🔥');
      setModalVisible(true);
    }
    if (scoreB === 10) {
      setWinner('⚡ Tim B Menang Besar! ⚡');
      setModalVisible(true);
    }
  }, [scoreA, scoreB]);

  return (
    <LinearGradient colors={['#1C1C54', '#403B74']} style={styles.container}>
      <Text style={styles.title}>⚽ Skor Pertandingan Futsal ⚽</Text>

      <View style={styles.scoreBox}>
        <Text style={styles.teamName}>🔥 Tim A 🔥</Text>
        <Animated.Text style={[styles.score, { transform: [{ scale: scaleAnim }] }]}>
          {scoreA}
        </Animated.Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => addScore('A')}>
            <LinearGradient colors={['#4CAF50', '#81C784']} style={styles.button}>
              <Text style={styles.buttonText}>🎯 Tambahkan Poin</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => subtractScore('A')}>
            <LinearGradient colors={['#FF7043', '#FF5252']} style={styles.button}>
              <Text style={styles.buttonText}>⚠️ Kurangi Poin</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scoreBox}>
        <Text style={styles.teamName}>⚡ Tim B ⚡</Text>
        <Animated.Text style={[styles.score, { transform: [{ scale: scaleAnim }] }]}>
          {scoreB}
        </Animated.Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => addScore('B')}>
            <LinearGradient colors={['#4CAF50', '#81C784']} style={styles.button}>
              <Text style={styles.buttonText}>🎯 Tambahkan Poin</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => subtractScore('B')}>
            <LinearGradient colors={['#FF7043', '#FF5252']} style={styles.button}>
              <Text style={styles.buttonText}>⚠️ Kurangi Poin</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={resetScores}>
        <LinearGradient colors={['#8E44AD', '#FFC107']} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>🔄 Reset Game</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal Notifikasi Kemenangan */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{winner}</Text>
          <Pressable onPress={resetScores}>
            <LinearGradient colors={['#3498db', '#5DADE2']} style={[styles.button, styles.modalButton]}>
              <Text style={styles.buttonText}>✔️ Oke</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F4F4F4',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 30,
    textAlign: 'center',
  },
  scoreBox: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 25,
    marginVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  score: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#FFD700',
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  resetButton: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  resetButtonText: {
    fontSize: 18,
    color: '#FFF',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 35,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    marginTop: 15,
  },
});
