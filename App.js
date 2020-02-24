/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';

import {
  createStackNavigator,
  createAppContainer,
} from '@react-navigation/stack';

import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import OtherScreen from './screens/OtherScreen';
import RevisionScreen from './screens/RevisionScreen';
import RecitationScreen from './screens/RecitationScreen';
import HelpScreen from './screens/HelpScreen';
import StudentScreen from './screens/StudentScreen';
import RestorePointScreen from './screens/RestorePointScreen';
import {ThemeProvider} from 'react-native-elements';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFontMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Button} from 'react-native-elements';
import PouchDB from 'pouchdb';
//const Realm = require('realm');
import {
  Image,
  StyleSheet,
  View,
  TouchableHighlight,
  Picker,
  Text,
  SafeAreaView,
} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {FlatGrid} from 'react-native-super-grid';
import NavigationService from './NavigationService';
import ArchiveScreen from './screens/ArchiveScreen';
PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default);
const RootStack = createStackNavigator();

const stylesMenu = StyleSheet.create({
  gridView: {
    marginTop: 20,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});

//const AppContainer = createAppContainer(RootStack);
export default function App() {
  const ref = React.useRef(null);
  const items = [
    {name: 'إدارة الحلقات', code: '#3c4b28', image: 'widgets', route: 'Home'},
    {name: 'الطلاب', code: '#3c4b28', image: 'group', route: 'Student'},
    {name: 'دليل المستخدم', code: '#3c4b28', image: 'help', route: 'Help'},
    {
      name: 'أرشيف الحلقات',
      code: '#3c4b28',
      image: 'settings',
      route: 'Archive',
    },
    {name: 'حول البرنامج', code: '#3c4b28', image: 'domain', route: 'Help'},
    {
      name: 'مزامنة البرنامج',
      code: '#3c4b28',
      image: 'sync',
      route: 'RestorePoint',
    },
  ];
  const [showDashboard, setShowDashboard] = useState(false);
  useEffect(() => {
    NavigationService.setTopLevelNavigator(ref);
    SplashScreen.hide();
    const db = new PouchDB('recitation_db', {adapter: 'asyncstorage'});
    const restorePointdb = new PouchDB('recitation_restorepoint_db', {
      adapter: 'asyncstorage',
    });

    db.changes().on('change', function() {
      console.log('Ch-Ch-Changes');
    });

    restorePointdb.put({_id: 'restorePoint', data: []});
    db.put({_id: 'team', data: []});
    // db.replicate.to('http://127.0.0.1:5984/recitation_db');
  }, []);

  return (
    <ThemeProvider>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <NavigationContainer ref={ref}>
            <RootStack.Navigator>
              <RootStack.Screen
                name="Home"
                component={HomeScreen}
                options={{title: 'إدارة الحلقات', headerBackTitle: 'رجوع'}}
              />
              <RootStack.Screen
                name="Other"
                component={OtherScreen}
                options={{headerBackTitle: 'رجوع'}}
              />
              <RootStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                  title: 'اٍدارة الطلاب',
                  headerBackTitle: 'رجوع',
                  headerLeft: () => (
                    <Button
                      onPress={() => ref.current.goBack()}
                      title="رجوع"
                      color="#fff"
                      type="clear"
                      icon={
                        <IconFontAwesome
                          name="angle-right"
                          size={25}
                          color="#2089dc"
                          style={{paddingRight: 5}}
                        />
                      }
                    />
                  ),
                }}
              />
              <RootStack.Screen
                name="Revision"
                component={RevisionScreen}
                options={{
                  title: 'التسميع',
                  headerBackTitle: 'رجوع',
                  headerLeft: () => (
                    <Button
                      onPress={() => ref.current.goBack()}
                      title="رجوع"
                      color="#fff"
                      type="clear"
                      icon={
                        <IconFontAwesome
                          name="angle-right"
                          size={25}
                          color="#2089dc"
                          style={{paddingRight: 5}}
                        />
                      }
                    />
                  ),
                }}
              />
              <RootStack.Screen
                name="Help"
                component={HelpScreen}
                options={{
                  title: 'دليل المستخدم',
                  headerBackTitle: 'رجوع',
                  headerLeft: () => (
                    <Button
                      onPress={() => ref.current.goBack()}
                      title="رجوع"
                      color="#fff"
                      type="clear"
                      icon={
                        <IconFontAwesome
                          name="angle-right"
                          size={25}
                          color="#2089dc"
                          style={{paddingRight: 5}}
                        />
                      }
                    />
                  ),
                }}
              />
              <RootStack.Screen
                name="Student"
                component={StudentScreen}
                options={{
                  title: 'الطلاب',
                  headerBackTitle: 'رجوع',
                  headerLeft: () => (
                    <Button
                      onPress={() => ref.current.goBack()}
                      title="رجوع"
                      color="#fff"
                      type="clear"
                      icon={
                        <IconFontAwesome
                          name="angle-right"
                          size={25}
                          color="#2089dc"
                          style={{paddingRight: 5}}
                        />
                      }
                    />
                  ),
                }}
              />
              <RootStack.Screen
                name="Recitation"
                component={RecitationScreen}
                options={{title: 'المصحف الشريف', headerBackTitle: 'رجوع'}}
              />
              <RootStack.Screen
                name="Archive"
                component={ArchiveScreen}
                options={{
                  title: 'أرشيف الحلقات',
                  headerBackTitle: 'رجوع',
                  headerLeft: () => (
                    <Button
                      onPress={() => ref.current.goBack()}
                      title="رجوع"
                      color="#fff"
                      type="clear"
                      icon={
                        <IconFontAwesome
                          name="angle-right"
                          size={25}
                          color="#2089dc"
                          style={{paddingRight: 5}}
                        />
                      }
                    />
                  ),
                }}
              />
              <RootStack.Screen
                name="RestorePoint"
                component={RestorePointScreen}
                options={{
                  name: 'مزامنة البرنامج',
                  headerBackTitle: 'رجوع',
                  headerLeft: () => (
                    <Button
                      onPress={() => ref.current.goBack()}
                      title="رجوع"
                      color="#fff"
                      type="clear"
                      icon={
                        <IconFontAwesome
                          name="angle-right"
                          size={25}
                          color="#2089dc"
                          style={{paddingRight: 5}}
                        />
                      }
                    />
                  ),
                }}
              />
            </RootStack.Navigator>
          </NavigationContainer>
          {/*AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    Home: {screen: HomeScreen, navigationOptions: {headerBackTitle: 'رجوع'}},
    Other: {screen: OtherScreen, navigationOptions: {headerBackTitle: 'رجوع'}},
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {headerBackTitle: 'رجوع'},
    },
    Revision: {
      screen: RevisionScreen,
      navigationOptions: {headerBackTitle: 'رجوع'},
    },
    Help: {screen: HelpScreen, navigationOptions: {headerBackTitle: 'رجوع'}},
    Student: {
      screen: StudentScreen,
      navigationOptions: {headerBackTitle: 'رجوع'},
    },
    Recitation: {
      screen: RecitationScreen,
      navigationOptions: {headerBackTitle: 'رجوع'},
    },
    Archive: {
      screen: ArchiveScreen,
      navigationOptions: {headerBackTitle: 'رجوع'},
    },
    RestorePoint: {
      screen: RestorePointScreen,
      navigationOptions: {headerBackTitle: 'رجوع'},
    },
  },
  {
    initialRouteName: 'Home',
    //mode: 'modal',
    //headerMode: 'none',
  },
          <AppContainer
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />*/}
          <GestureRecognizer
            style={{backgroundColor: '#3d4c29'}}
            onSwipeUp={gestureState => {
              setShowDashboard(true);
            }}
            config={{
              velocityThreshold: 0.3,
              directionalOffsetThreshold: 80,
            }}>
            <Button
              onPress={() => {
                setShowDashboard(true);
              }}
              icon={
                <IconFontAwesome
                  name="angle-double-up"
                  size={25}
                  color="white"
                />
              }
              type="clear"
            />
          </GestureRecognizer>
          {showDashboard && (
            <View
              style={{
                borderRadius: 20,
                position: 'absolute',
                top: 80,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#8fc400',
                // borderWidth: 1,
                borderColor: '#000',
                borderBottomWidth: 0,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
              }}>
              <Button
                onPress={() => {
                  setShowDashboard(false);
                }}
                icon={
                  <IconFontAwesome
                    name="angle-double-down"
                    size={25}
                    color="white"
                  />
                }
                type="clear"
              />
              <GestureRecognizer
                onSwipeDown={gestureState => {
                  setShowDashboard(false);
                }}
                config={{
                  velocityThreshold: 0.3,
                  directionalOffsetThreshold: 80,
                }}
                style={{
                  flex: 1,
                }}>
                <FlatGrid
                  itemDimension={130}
                  items={items}
                  style={stylesMenu.gridView}
                  // staticDimension={300}
                  // fixed
                  // spacing={20}
                  renderItem={({item, index}) => (
                    <View
                      style={[
                        stylesMenu.itemContainer,
                        {backgroundColor: item.code},
                      ]}>
                      <TouchableHighlight
                        style={{height: 130}}
                        onPress={() => {
                          ref.current.navigate(item.route);
                          setShowDashboard(false);
                        }}>
                        <View style={{height: 130, paddingTop: 60}}>
                          <IconFontMaterialIcons
                            name={item.image}
                            type="material-community"
                            size={55}
                            color="white"
                          />
                          <Text style={stylesMenu.itemName}>{item.name}</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  )}
                />
              </GestureRecognizer>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
}
