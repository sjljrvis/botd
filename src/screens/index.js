import React , {Component} from 'react'
import { createStackNavigator ,createAppContainer,StackNavigator,createSwitchNavigator} from 'react-navigation'
import Splash from './Splash'
import AppStack from './AppScreen'

const Stacks = createSwitchNavigator({
  Splash: {
    screen: Splash,
  },
  AppStack:{
    screen: AppStack
  }
});
export default createAppContainer(Stacks)

