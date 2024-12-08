import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from './Colors.js'; 
import tempData from './tempData.js';
import TodoList from './components/Todo List.js';
import AddListModal from './components/AddListModal.js';
import Fire from './Fire.js';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; // Ensure Firebase Firestore is correctly imported

export default class App extends React.Component {
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true
  };

  componentDidMount() {
    // Initialize Firebase and handle user authentication
    this.firebaseApp = new Fire((error, user) => {
      if (error) {
        alert("Sorry, there was an error!");
        return;
      }

      // Fetch lists after successful Firebase authentication
      this.firebaseApp.getLists(lists => {
        if (lists) {
          this.setState({ lists, user, loading: false });
        }
      });

      this.setState({ user });
    });
  }

  componentWillUnmount() {
    if (this.firebaseApp) {
      this.firebaseApp.detach(); // Detach the Firebase listener when the component is unmounted
    }
  }

  // Toggle modal visibility
  toggleAddTodoModal = () => {
    this.setState(prevState => ({
      addTodoVisible: !prevState.addTodoVisible
    }));
  };

  renderList = (list) => {
    return <TodoList list={list} updateList={this.updateList} />;
  };

  addList = (list) => {
    // Add a new list to Firebase
    this.firebaseApp.addList({
      name: list.name,
      color: list.color,
      todos: []
    });
  };

  updateList = (list) => {
    // Update the list in Firebase
    this.firebaseApp.updateList(list);
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.blue} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          visible={this.state.addTodoVisible}
          onRequestClose={this.toggleAddTodoModal}
        >
          <AddListModal closeModal={this.toggleAddTodoModal} addList={this.addList} />
        </Modal>

        <View style={{ flexDirection: 'row' }}>
          <View style={styles.divider} />
          <Text style={styles.title}>
            Todo <Text style={{ fontWeight: '300', color: Colors.blue }}>Lists</Text>
          </Text>
          <View style={styles.divider} />
        </View>

        <View style={{ marginVertical: 48, alignItems: 'center' }}>
          <TouchableOpacity style={styles.addList} onPress={this.toggleAddTodoModal}>
            <AntDesign name="plus" size={16} color={Colors.blue} />
          </TouchableOpacity>
          <Text style={styles.add}>ADD List</Text>
        </View>

        {/* FlatList to display Todo lists */}
        <View style={{ height: 275, paddingLeft: 32 }}>
          <FlatList
            data={this.state.lists}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => this.renderList(item)}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  divider: {
    backgroundColor: Colors.lightblue,
    height: 1,
    flex: 1,
    alignSelf: 'center'
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.black,
    paddingHorizontal: 64
  },
  addList: {
    borderWidth: 2,
    borderColor: Colors.lightblue,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  add: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blue
  }
});
