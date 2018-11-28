
import React, { Component } from 'react'
import { Text, View, KeyboardAvoidingView, TextInput, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DirectLine } from "botframework-directlinejs";
import Voice from 'react-native-voice';
import Messages from './Message'
import styles from './style'
import Camera from 'react-native-camera';

const directLine = new DirectLine({
  secret: "hvdUZWb1yeE.cwA.L4Q.Io8v79ztRewrHEFFXyivUaMPGs3GTUbfgfzd1pdd3bE"
});

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      quickReplies: [],
      currentMessage: "",
      recognized: '',
      started: '',
      results: [],
      placeholder: "Type your message"
    }

    Voice.onSpeechStart = this.onSpeechStart.bind(this)
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this)
    Voice.onSpeechResults = this.onSpeechResults.bind(this)


    directLine.activity$.subscribe(botMessage => {
      console.log(botMessage)
      let quickReplies = [];
      let newMessage;
      if (!botMessage.from.client) {
        if (botMessage.attachments) {
          if (botMessage.attachments[0].content && !botMessage.attachments[0].content.title) {
            quickReplies = botMessage.attachments[0].content.buttons.map(button => {
              return {
                title: button.title,
                value: button.value,
                type: button.type
              }
            })
            newMessage = this.botMessageToWebMessage(botMessage);
            this.setState({ messages: [newMessage, ...this.state.messages], quickReplies });
          }
          else if (botMessage.attachments[0].payload) {
            newMessage = this.botMessageToWebMessage(botMessage);
            this.setState({ messages: [newMessage, ...this.state.messages], quickReplies });
          }
        }
        if (botMessage.suggestedActions) {
          quickReplies = botMessage.suggestedActions.actions.map((item, index) => {
            return {
              title: item.title,
              value: item.value,
              type: item.type
            }
          })
          this.setState({ quickReplies })
        }
        else {
          newMessage = this.botMessageToWebMessage(botMessage);
          this.setState({ messages: [newMessage, ...this.state.messages], quickReplies });
        }
      }
    });

  }

  botMessageToWebMessage = (botMessage) => {
    return {
      ...botMessage,
      isBot: true,
      _id: botMessage.id,
      createdAt: botMessage.timestamp,
      from: {
        _id: "Bot",
        avatar: ""
      }
    }
  }

  webMessageToBotMessage = (message, self) => {
    return {
      from: { id: "userName", name: "userName", client: true, user_id: null },
      type: "message",
      text: message.text,
      payload: message.payload || null
    };
  }

  prepareMessageAndSend = (message) => {
    this.textInput.clear();
    this.setState({ quickReplies: [], showMenuOption: false })
    let msg = {
      isBot: false,
      user: {
        _id: 123,
        avatar: ""
      },
      text: message.text,
      payload: message.payload || null,
      type: "message"
    }
    this.setState({ currentMessageText: "" })
    if (message.text !== "") { this.onSend([msg]) }
  }


  onSend = (messages) => {
    let self = this;
    this.setState({ messages: [...messages, ...this.state.messages] })
    messages.forEach(message => {
      directLine
        .postActivity(this.webMessageToBotMessage(message, self))
        .subscribe(() => { },
          () => console.log("failed"));
    });
  }


  onSpeechStart(e) {
    this.setState({
      placeholder: 'Listening ...',
    });
  }

  onSpeechEnd(e){
    this.setState({
      placeholder : "Type your message"
    })
  }

  onSpeechRecognized(e) {
  }

  onSpeechResults(e) {
    this.setState({ placeholder: "Type your message" })
    this.prepareMessageAndSend({ text: e.value[0] })
  }

  async _startRecognition(e) {
    this.setState({
      recognized: '',
      started: '',
      results: [],
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }


  onBarCodeRead = (e) => this.setState({qrcode: e.data});


  componentDidMount() {
  }


  render() {

    let { messages, quickReplies, currentMessage, placeholder } = this.state;

    return (
      <SafeAreaView style={styles.container}>

       <Camera
                    style={styles.preview}
                    onBarCodeRead={this.onBarCodeRead}
                    ref={cam => this.camera = cam}
                    aspect={Camera.constants.Aspect.fill}
                    >
                        <Text style={{
                            backgroundColor: 'white'
                        }}>{this.state.qrcode}</Text>
                    </Camera>

        {/* <KeyboardAvoidingView style={styles.keyboardAvoidContainer}>


            <View style={{ height: 50, backgroundColor: "#FFFFFF", backgroundColor: "#FFFFFF", justifyContent: "space-between", flexDirection: "row", alignContent: "center", alignItems: "center", paddingLeft: 10, paddingRight: 10 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", display: "flex", flexDirection: "row", alignContent: "center", alignItems: "center" }}
              >
                <Icon name="ios-arrow-round-back" size={40} color="#4ea1f4"></Icon>
              </TouchableOpacity>


              <View style={{ display: "flex", flexDirection: "row" }}>
                <TouchableOpacity
                  style={{ justifyContent: "center", width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", display: "flex", flexDirection: "row", alignContent: "center", alignItems: "center" }}
                >
                  <Icon name="ios-barcode" size={30} color="#4ea1f4"></Icon>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ justifyContent: "center", width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", display: "flex", flexDirection: "row", alignContent: "center", alignItems: "center" }}
                >
                  <Icon name="ios-refresh" size={20} color="#4ea1f4"></Icon>
                </TouchableOpacity>
              </View>

            </View>







            <ScrollView style={{ flex: .8 }} >
              <Messages messages={messages} />
            </ScrollView>




            <View style={{ height: 60, justifyContent: "center", flexDirection: "row", alignContent: "center", alignItems: "center", paddingLeft: 10, paddingRight: 10 }}>
              <ScrollView horizontal={true}>
                <TouchableOpacity style={{
                  marginLeft: 10, marginRight: 10,
                  borderStyle: "solid", borderWidth: 1, borderColor: "#4ea1f4", padding: 5, backgroundColor: "#FFFFFF", justifyContent: "center", flexDirection: "row", alignContent: "center", alignItems: "center", borderRadius: 4
                }}>
                  <Text style={{ color: "#4ea1f4", margin: 5 }}>English</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <View style={{ height: 75, backgroundColor: "#FFFFFF", justifyContent: "center", flexDirection: "row", alignContent: "center", alignItems: "center", paddingLeft: 10, paddingRight: 10 }}>



              <TouchableOpacity
                onPress={this._startRecognition.bind(this)}
                style={{ justifyContent: "center", width: 40, height: 40, borderRadius: 20, backgroundColor: "#4ea1f4", display: "flex", flexDirection: "row", alignContent: "center", alignItems: "center" }}
              >
                <Icon name="ios-mic" size={20} color="#FFFFFF"></Icon>
              </TouchableOpacity>


              <TextInput
                ref={input => { this.textInput = input }}
                style={{ width: "80%" }}
                placeholder={placeholder}
                onChangeText={(e) => this.setState({ currentMessage: e })}
              />


              <TouchableOpacity
                style={{ justifyContent: "center", width: 40, height: 40, borderRadius: 20, backgroundColor: "#ffffff", display: "flex", flexDirection: "row", alignContent: "center", alignItems: "center" }}
                onPress={() => this.prepareMessageAndSend({ text: currentMessage })}
              >
                <Icon name="ios-send" size={30} color="#4ea1f4"></Icon>
              </TouchableOpacity>


            </View>

        </KeyboardAvoidingView> */}
      </SafeAreaView>
    );
  }
}

