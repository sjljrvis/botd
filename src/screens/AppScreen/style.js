import { StyleSheet } from 'react-native'

let styles = StyleSheet.create({
  container: {
    flex: 1
  },
  keyboardAvoidContainer: {
    flex: 1,
    flexDirection : "column",
    justifyContent : "center"
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})

export default styles
