
import React, { Component } from 'react'
import { Text, View, KeyboardAvoidingView, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Modal, Button, WebView, ActivityIndicator, DatePickerAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DirectLine, ConnectionStatus } from "botframework-directlinejs";
import Voice from 'react-native-voice';
import Messages from './Message'
import styles from './style'
import Camera from 'react-native-camera';

let directLine = null;

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
      placeholder: "Type your message",
      showCamera: false,
      showWebView: false,
      showSpinner: true,
      webViewUrl: ""
    }

    directLine = new DirectLine({
      secret: "hvdUZWb1yeE.cwA.L4Q.Io8v79ztRewrHEFFXyivUaMPGs3GTUbfgfzd1pdd3bE"
    });


    Voice.onSpeechStart = this.onSpeechStart.bind(this)
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this)
    Voice.onSpeechResults = this.onSpeechResults.bind(this)


    directLine.activity$.subscribe(botMessage => {
      // console.log(botMessage)
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
            // if(botMessage.text){
            //   botMessage.attachments = null;
            // }
            newMessage = this.botMessageToWebMessage(botMessage);
            this.setState({ quickReplies });
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

          if(quickReplies.filter(x => x.type == "openUrl").length > 0){
            quickReplies.push({
              title : "Proceed",
              value : "Proceed",
              type : "imBack"
            })
          }

          newMessage = this.botMessageToWebMessage(botMessage);
          this.setState({ messages: [newMessage, ...this.state.messages], quickReplies })
        }
        else {
          if (botMessage.text == "Ok! thanks. you usually get it by mail, which can take up to 6 days. when are you going for vacation?") {
            quickReplies = [{ type: "openDatePicker", title: "Select Date", value: "default" }]
            newMessage = this.botMessageToWebMessage(botMessage);
            this.setState({ messages: [newMessage, ...this.state.messages], quickReplies });
          }
          else {
            newMessage = this.botMessageToWebMessage(botMessage);
            this.setState({ messages: [newMessage, ...this.state.messages], quickReplies });
          }

        }
      }
    });


    directLine.connectionStatus$
      .subscribe(connectionStatus => {
        console.log(ConnectionStatus[connectionStatus])
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

  onSpeechEnd(e) {
    this.setState({
      placeholder: "Type your message"
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

  handleQuickReplies = (quickReplies) => {
    if (quickReplies.type == "openUrl") {
      this.setState({ webViewUrl: quickReplies.value, showWebView: true })
    }
    else if(quickReplies.type == "openDatePicker"){
      this.loadDatePicker();
    }
    else {
      this.prepareMessageAndSend({ text: quickReplies.value })
    }
  }

  onBarCodeRead = (e) => {
    this.prepareMessageAndSend({ text: e.data })
    this.setState({ showCamera: false });
  }

  loadDatePicker = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        console.log("No date selected")
      }
      if (action == DatePickerAndroid.dateSetAction) {
        this.prepareMessageAndSend({ text: new Date(year, month, day).toDateString() })
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  componentDidMount() {

    this.prepareMessageAndSend({ text: this.props.navigation.state.params.msg })

  }

  componentWillUnmount() {
    try {
      directLine.end();
    } catch (e) {
      console.log(e.message)
    }
  }


  render() {

    let { messages, quickReplies, currentMessage, placeholder, showCamera, showSpinner, showWebView, webViewUrl } = this.state;

    return (
      <SafeAreaView style={styles.container}>

        {
          showCamera ?
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
            :

            <KeyboardAvoidingView style={styles.keyboardAvoidContainer}>


              <View style={{ height: 50, backgroundColor: "#FFFFFF", backgroundColor: "#FFFFFF", justifyContent: "space-between", flexDirection: "row", alignContent: "center", alignItems: "center", paddingLeft: 10, paddingRight: 10 }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Splash")}
                  style={{ justifyContent: "center", width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", display: "flex", flexDirection: "row", alignContent: "center", alignItems: "center" }}
                >
                  <Icon name="ios-arrow-round-back" size={40} color="#4ea1f4"></Icon>
                </TouchableOpacity>


                <View style={{ display: "flex", flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => this.setState({ showCamera: true })}
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







              <ScrollView style={{ flex: .8 }}
                ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  this.scrollView.scrollToEnd({ animated: true });
                }}
              >
                <Messages messages={messages} />
              </ScrollView>


              <Modal
                animationType="slide"
                transparent={true}
                visible={showWebView}
                onRequestClose={() => console.log("closing modal")}
              >
                <View style={{ flex: 1 }}>

                  <View style={{ flex: .3 }}>
                  </View>

                  <View style={{ flex: .7 }}>
                    <WebView
                      ref={(view) => this.webView = view}
                      source={{ uri: webViewUrl }}
                      flex={1}
                      scalesPageToFit={true}
                      onLoadEnd={() => { this.setState({ showSpinner: false }) }}
                      onMessage={(e) => { this.exitWebView(e) }}
                      javaScriptEnabled={true}
                      allowUniversalAccessFromFileURLs={true}
                      mixedContentMode={"always"}
                      style={{ backgroundColor: "#F8F8F8" }}
                    />
                    {showSpinner ?
                      <ActivityIndicator size="large" color="#4ea1f4" /> : null
                    }
                  </View>

                  <Button style={{ height: 60 }} title="close"
                    onPress={() => {
                      this.setState({ showWebView: false })
                    }}
                  ></Button>

                </View>
              </Modal>










              <View style={{ height: 60, justifyContent: "center", flexDirection: "row", alignContent: "center", alignItems: "center", paddingLeft: 10, paddingRight: 10 }}>
                <ScrollView horizontal={true}>
                  {
                    quickReplies.map((item, index) => {
                      return (
                        <TouchableOpacity key={index}
                          onPress={() => this.handleQuickReplies(item)}
                          style={{
                            marginLeft: 10, marginRight: 10,
                            borderStyle: "solid", borderWidth: 1, borderColor: "#4ea1f4", padding: 5, backgroundColor: "#FFFFFF", justifyContent: "center", flexDirection: "row", alignContent: "center", alignItems: "center", borderRadius: 4
                          }}>
                          <Text style={{ color: "#4ea1f4", margin: 5 }}>{item.title == 'Payment' ? "Open link" : item.title}</Text>
                        </TouchableOpacity>
                      )
                    })
                  }
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
                  onPress={() => {
                    this.prepareMessageAndSend({ text: currentMessage })
                    this.textInput.clear();
                  }
                  }
                >
                  <Icon name="ios-send" size={30} color="#4ea1f4"></Icon>
                </TouchableOpacity>


              </View>

            </KeyboardAvoidingView>
        }
      </SafeAreaView>
    );
  }
}

