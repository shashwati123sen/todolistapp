import { Text, View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native';
import React, { Component } from 'react';
import { AntDesign } from '@expo/vector-icons';
import Colors from "../Colors"; // Corrected import

export default class AddlistModal extends React.Component {
  backgroundColors = ["#5CD859", "#24A6D9", "#8022D9", "#D15963", "#D85963", "#D88559"];

  state = {
    name: "",  // Fixed the initial value (removed extra space)
    color: this.backgroundColors[0]
  };

  createTodo = () => {
    const { name, color } = this.state; // Destructuring the state

    if (name.trim() === "") {
      return; // Prevent creating a list with an empty name
    }

    const list = { name, color };
    this.props.addList(list); // Pass the list object to the parent

    this.setState({ name: "" }); // Reset the name field
    this.props.closeModal(); // Close the modal after creating the list
  }

  renderColors() {
    return this.backgroundColors.map(color => (
      <TouchableOpacity
        key={color}
        style={[styles.colorselect, { backgroundColor: color }]}
        onPress={() => this.setState({ color })}
      />
    ));
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TouchableOpacity
          style={{ position: "absolute", top: 64, right: 32 }}
          onPress={this.props.closeModal}
        >
          <AntDesign name="close" size={24} color={Colors.black} /> {/* Corrected color usage */}
        </TouchableOpacity>

        <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
          <Text style={styles.title}>Create Todo List</Text>

          <TextInput
            style={styles.input}
            placeholder="List Name"
            onChangeText={text => this.setState({ name: text })}
            value={this.state.name}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
            {this.renderColors()}
          </View>

          <TouchableOpacity
            style={[styles.create, { backgroundColor: this.state.color, marginTop: 12 }]}
            onPress={this.createTodo}
          >
            <Text style={{ color: Colors.white, fontWeight: "600" }}>Create!</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.black,
    alignSelf: "center",
    marginBottom: 16
  },
  input: {
    height: 50,
    borderColor: Colors.lightblue,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    paddingHorizontal: 16,
    marginTop: 8,
    fontSize: 18
  },
  create: {
    marginTop: 34,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  colorselect: {
    width: 30,
    height: 30,
    borderRadius: 4
  }
});
