
import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


export default class App extends Component {

  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Bot Demo</Text>

        <TouchableOpacity onPress={() => this.props.navigation.navigate("AppStack", { msg: "Hello" })}
        style={{margin :20 , padding : 20 , backgroundColor : "#4ea1f4" , borderRadius : 4 , color : " #FFFFFF"}}
        >
          <Text style={{ color : "#FFFFFF"}}>myMPD</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.navigate("AppStack", { msg: "Hello" })}
         style={{margin :20 , padding : 20 , backgroundColor : "#4ea1f4" , borderRadius : 4 , color : " #FFFFFF"}}
        >
          <Text style={{ color : "#FFFFFF"}}>Iron Mountain</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  }
});
