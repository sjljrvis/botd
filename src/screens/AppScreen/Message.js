
import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


export default class Messages extends Component {






  renderTextMessages = (message, index) => {
    if (message.isBot) {
      return (
        <View
          key={index}
          style={{ width: "100%", marginTop: 10, marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
        >
          <Text style={{ padding: 10, backgroundColor: "#e2e2e2", color: "#666666", alignSelf: 'flex-start', borderRadius: 5, maxWidth: "70%" }}>
            {message.text}
          </Text>
        </View>
      )
    }
    else {
      return (
        <View
          key={index}
          style={{ width: "100%", marginTop: 10, marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
        >
          <Text style={{ padding: 10, backgroundColor: "#4ea1f4", color: "#FFFFFF", alignSelf: 'flex-end', borderRadius: 5, maxWidth: "70%" }}>
            {message.text}
          </Text>
        </View>
      )
    }
  }


  componentDidMount() {

  }


  render() {
    let { messages } = this.props;
    return (
      <View style={{display : "flex" , flexDirection : "column-reverse"}}>

        {
          messages.map((message, index) => {
            if (message.attachments) {
              return null
            }
            else {
              return this.renderTextMessages(message, index)
            }
          })
        }
        </View>
    );
  }
}
