
import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';


export default class App extends Component {

  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>

        <View style={{}}>
          <Image source={require('../../assets/idai-logo.png')} style={{}}></Image>
        </View>
        
        <TouchableOpacity onPress={() => this.props.navigation.navigate("AppStack", { msg: "flow 1" })}
          style={{ margin: 20, padding: 20, backgroundColor: "#4ea1f4", borderRadius: 4, color: " #FFFFFF" }}
        >
          <Text style={{ color: "#FFFFFF" }}>myMPD</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.navigate("AppStack", { msg: "flow 2" })}
          style={{ margin: 20, padding: 20, backgroundColor: "#4ea1f4", borderRadius: 4, color: " #FFFFFF" }}
        >
          <Text style={{ color: "#FFFFFF" }}>Iron Mountain</Text>
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
    padding: 10
  }
});
