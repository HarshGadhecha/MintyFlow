import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

export default function AddScreen() {
  const { theme } = useTheme();

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Add Transaction</Text>
        <TouchableOpacity onPress={handleClose}>
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, { backgroundColor: theme.success }]}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
            <Text style={styles.typeButtonText}>Income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, { backgroundColor: theme.error }]}
          >
            <Ionicons name="remove" size={24} color="#FFFFFF" />
            <Text style={styles.typeButtonText}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, { backgroundColor: theme.info }]}
          >
            <Ionicons name="swap-horizontal" size={24} color="#FFFFFF" />
            <Text style={styles.typeButtonText}>Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  typeSelector: {
    gap: 16,
    marginTop: 20,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
    borderRadius: 16,
  },
  typeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
