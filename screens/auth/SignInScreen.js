import React from 'react';
import {Button, StyleSheet, View, TextInput} from 'react-native';
import { login } from '../../util/APIUtils';
import { ACCESS_TOKEN } from '../../constants';
import AsyncStorage from '@react-native-community/async-storage';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class SignInScreen extends React.Component {
    constructor(props){
        super(props)
        this.state={
            username: "hani@gmail.com",
            password: "123"
        }
    }
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to translate!"
          onChangeText={text => this.setState({username:text})}
          value={this.state.username}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Type here to translate!"
          onChangeText={text => this.setState({password: text})}
          value={this.state.password}
        />
        <Button title="Sign in!" onPress={()=>{
            login({email: this.state.username, password: this.state.password}).then(
                response=>{
                    this._signInAsync(ACCESS_TOKEN, response.access_token)
                }
            ).catch(error=> console.log(error))}
        } />
      </View>
    );
  }

  _signInAsync = async (key, value) => {
    await AsyncStorage.setItem(key, value);
    this.props.navigation.navigate('App');
  };
}
export default SignInScreen;
