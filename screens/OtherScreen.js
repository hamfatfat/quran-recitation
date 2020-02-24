import React from 'react';
import {
    Image,
    Button,
    StatusBar,
    StyleSheet,
    View,
    Text,
  } from 'react-native';

  import AsyncStorage from '@react-native-community/async-storage';
import { stepsFetchAll } from '../util/APIUtils';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 120
    },
  });
  
class OtherScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Welcome3'
    };
    constructor(props) {
        super(props);
        this.state = {dataSource: [], isLoading: true};
      }
    async componentDidMount() {
        try {
        const responseJson = await stepsFetchAll(1);
        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function () { });
      }
      catch (error) {
        console.error(error);
      }
      }
    render() {
      return (
        <View style={styles.container}> 
          {/*<Button title="Go to Jane's profile"onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}/>
          <Button title="I'm done, sign me out" onPress={this._signOutAsync} />*/}
          <View
          style={{
            flex: 1,
            flexDirection: 'row-reverse',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          {this.state.dataSource.map(item => (
            <View
              style={{
                width: 150,
                height: 150,
                backgroundColor: 'powderblue',
                margin: 10,
                color: 'white',
              }}>
              <Text>
                {item.name}, {item.name}
              </Text> 
              <Button onPress={()=>{this.props.navigation.navigate("Revision", {
              itemId: item.id
            })}} title={"Student"}/>
            </View>
          ))}
        </View>
          <StatusBar barStyle="default" />
        </View>
      );
    }
  
    _signOutAsync = async () => {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
    };
  }
  export default OtherScreen;