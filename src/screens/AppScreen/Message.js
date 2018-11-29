
import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Carousel from './Templates/carousel'

export default class Messages extends Component {




  renderCustomTemplates = (message, index) => {
    if (message.attachmentLayout == "carousel") {
      return <Carousel  attachments = {message.attachments} key={index}/>
    }
    else if(message.text){
      return this.renderTextMessages(message, index)
    }
  }

  renderTextMessages = (message, index) => {
    if (message.type == "message") {
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
  }


  componentDidMount() {

  }


  render() {
    let { messages } = this.props;
    return (
      <View style={{ display: "flex", flexDirection: "column-reverse" }}>
        {
          messages.map((message, index) => {
            if (message.text !== "flow 1" || message.text !== "flow 2") {
              if (message.attachments) {
                return this.renderCustomTemplates(message, index)
              }
              else {
                return this.renderTextMessages(message, index)
              }
            }
          })
        }
      </View>
    );
  }
}
