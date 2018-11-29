
import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';


export default class Carousel extends Component {


  render() {
    return (

      <View style={{ marginTop: 10, marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}>
        {
          this.props.attachments.map((item, index) => {
            return (
              <View key={index}>
                {
                  item.content.images.map((image, index) => {
                    return (
                      <Image source={{ uri: image.url }} style={{ width: 250, height: 250 }} key={index} />
                    )
                  })
                }
              </View>
            )
          })
        }
      </View>


    );
  }
}
