import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Animated } from 'react-native';
import React, { Component } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../Colors';
import 'react-native-gesture-handler';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';  // Import GestureHandlerRootView and Swipeable

export default class TodoModal extends Component {
  state = {
    newTodo: ""
  };

  toggleTodoCompleted = index => {
    let list = this.props.list;
    list.todos[index].completed = !list.todos[index].completed;

    this.props.updateList(list);
  };

  addTodo = () => {
    let list = this.props.list;

    if (!list.todos.some(todo => todo.title === this.state.newTodo)) {
      list.todos.push({ title: this.state.newTodo, completed: false });
      this.props.updateList(list);
    }

    this.setState({ newTodo: "" });
  };

  deleteTodo = index => {
    let list = this.props.list;
    list.todos.splice(index, 1);

    this.props.updateList(list);
  };

  RightActions = (dragX, index) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.9],
      extrapolate: "clamp"
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, -20, 0],
      outputRange: [1, 0.9, 0],
      extrapolate: "clamp"
    });

    return (
      <TouchableOpacity onPress={() => this.deleteTodo(index)}>
        <Animated.View style={[styles.deleteButton, { opacity: opacity }]}>
          <Animated.Text style={{ color: Colors.white, fontWeight: "800", transform: [{ scale }] }}>
            Delete
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  renderTodo = (todo, index) => {
    return (
      <Swipeable renderRightActions={(_, dragX) => this.RightActions(dragX, index)}>
        <View style={styles.todoContainer}>
          <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
            <Ionicons
              name={todo.completed ? "square" : "square-outline"}
              size={24}
              color={Colors.grey}
              style={{ width: 32 }}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.todo,
              {
                textDecorationLine: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? Colors.grey : Colors.black
              }
            ]}
          >
            {todo.title}
          </Text>
        </View>
      </Swipeable>
    );
  };

  render() {
    const list = this.props.list;
    const taskCount = list.todos.length;
    const completedCount = list.todos.filter(todo => todo.completed).length;

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Wrap the top-level component in GestureHandlerRootView */}
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <SafeAreaView style={styles.container}>
            <TouchableOpacity
              style={{ position: 'absolute', top: 64, right: 32, zIndex: 10 }}
              onPress={this.props.closeModal}
            >
              <AntDesign name="close" size={24} color={Colors.black} />
            </TouchableOpacity>

            <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
              <View>
                <Text style={styles.title}>{list.name}</Text>
                <Text style={styles.taskCount}>
                  {completedCount} of {taskCount} tasks
                </Text>
              </View>
            </View>

            <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
              <FlatList
                data={list.todos}
                renderItem={({ item, index }) => this.renderTodo(item, index)}
                keyExtractor={item => item.title}
                showsVerticalScrollIndicator={false}
              />
            </View>

            <View style={[styles.section, styles.footer]}>
              <TextInput
                style={[styles.input, { borderColor: list.color }]}
                onChangeText={text => this.setState({ newTodo: text })}
                value={this.state.newTodo}
              />
              <TouchableOpacity style={[styles.addTodo, { backgroundColor: list.color }]} onPress={() => this.addTodo()}>
                <AntDesign name="plus" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </GestureHandlerRootView> 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  section: {
    alignSelf: "stretch"
  },
  header: {
    justifyContent: "flex-end",
    marginLeft: 64,
    borderBottomWidth: 3,
    paddingTop: 18
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.black
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: Colors.grey,
    fontWeight: "600"
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  todoContainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 32
  },
  todo: {
    color: Colors.black,
    fontWeight: "700",
    fontSize: 16
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.blue,
    justifyContent: "center",
    alignItems: "center",
    width: 80
  }
});
