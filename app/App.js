import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  bg: '#494949',
  lightGray: '#727272',
  primary: '#fff',
  white: '#fff',
  darkGray: '#363636',
};
const App = () => {
  const [textInput, setTextInput] = useState('');
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    getTasksData();
  }, []);

  useEffect(() => {
    saveTaskUserDevice(tasks);
  }, [tasks]);
  const ListItem = ({task}) => {
    return (
      <View style={styles.ListItem}>
        <View style={{flex: 1}}>
          <Text
            style={[
              styles.Text,
              {textDecorationLine: task?.completed ? 'line-through' : 'none'},
            ]}>
            {task?.title}
          </Text>
        </View>
        <TouchableOpacity>
          <Icon
            name="done"
            style={[
              styles.listIcon,
              {backgroundColor: task?.completed ? '#439A86' : COLORS.lightGray},
            ]}
            onPress={() => markTask(task.id)}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            name="delete"
            onPress={() => deleteTask(task.id)}
            style={styles.listIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const saveTaskUserDevice = async Tasks => {
    try {
      const stringifyTasks = JSON.stringify(Tasks);
      await AsyncStorage.setItem('Tasks', stringifyTasks);
    } catch (error) {
      console.log(error);
    }
  };
  const getTasksData = async () => {
    try {
      const value = await AsyncStorage.getItem('Tasks');
      console.log('tasks data', value);
      if (value != null) {
        setTasks(JSON.parse(value));
        console.log(value, 'json value');
      }
      // return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e, 'erro');
      // error reading value
    }
  };

  const addTask = () => {
    if (textInput.trim()) {
      setTasks([
        ...tasks,
        {
          id: uuid.v4(),
          title: textInput,
          completed: false,
        },
      ]);
      setTextInput('');
    }
  };
  const deleteTask = taskID => {
    setTasks(tasks.filter(task => taskID !== task.id));
  };
  const clearTasks = () => {
    Alert.alert('Confirme', 'Apagar todos ?', [
      {text: 'Sim', onPress: () => setTasks([])},
      {text: 'Não'},
    ]);
  };
  const markTask = taskID => {
    setTasks(
      tasks.map(task =>
        task.id === taskID
          ? {...task, completed: !task.completed.valueOf()}
          : task,
      ),
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.bg}}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Todo App</Text>
        <Icon name="delete" onPress={clearTasks} style={styles.headerText} />
      </View>
      <View style={{marginTop: 10}}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={tasks}
          renderItem={({item}) => <ListItem task={item} />}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.footerInput}>
          <TextInput
            onChangeText={text => {
              setTextInput(text);
            }}
            value={textInput}
            placeholder="Add Task"
          />
        </View>
        <TouchableOpacity>
          <View style={styles.footerIcon}>
            <Icon
              onPress={addTask}
              name="add"
              style={[styles.headerText, styles.inputAdd]}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputAdd: {
    padding: 15,
  },
  headerText: {
    fontSize: 20,
    color: COLORS.primary,
  },
  Text: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightGray,
  },
  footerInput: {
    flex: 1,
    borderRadius: 13,
    backgroundColor: COLORS.white,
    elevation: 40,
    margin: 10,
  },
  footerIcon: {
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
    color: COLORS.white,
    borderRadius: 50,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  ListItem: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    flexDirection: 'row',
    backgroundColor: COLORS.darkGray,
    marginHorizontal: 8,
    marginVertical: 10,
    borderRadius: 13,
    color: 'white',
    elevation: 12,
  },
  listIcon: {
    color: COLORS.white,
    marginLeft: 8,
    fontSize: 16,
    backgroundColor: COLORS.lightGray,
    padding: 4,
    borderRadius: 4,
  },
});

export default App;
