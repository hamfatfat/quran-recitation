import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  TouchableHighlight,
  Picker,
  Text,
  Alert,
} from 'react-native';
import {Button} from 'react-native-elements';
import {Icon, Fab, Form, Item} from 'native-base';
import {Overlay, Text as ElementsText} from 'react-native-elements';
import {Input} from 'react-native-elements';

import {ImageBackground} from 'react-native';
import PouchDB from 'pouchdb';
import * as dataSteps from '../data/configuration.json';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default);
const uuidv4 = require('uuid/v4');
const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

class ArchiveScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      active: false,
      isLoading: true,
      dialogIsVisible: false,
      selected2: '13',
      halakaName: '',
      steps: [],
      height: 100,
      showDashboard: false,
      halakaDeleteId: null,
    };
  }
  onValueChange2(itemValue, itemIndex) {
    this.setState({
      selected2: itemValue,
    });
  }
  async componentDidMount() {
    // try {
    const self = this;
    const db = new PouchDB('recitation_db', {adapter: 'asyncstorage'});
    db.get('team').then(function(doc) {
      let data = doc.data;
      data=data.filter(x=>x.archive===true)
      self.setState({
        dataSource: data === undefined ? [] : data,
        steps: dataSteps.steps,
      });
    });
  }
  /*   const responseJson = await recitationCentersFetchAll();
      this.setState(
        {
          isLoading: false,
          // dataSource: responseJson,
        },
        function() {},
      );
    } catch (error) {
      console.error(error);
    }*/
  async componentDidUpdate() {
    const self = this;
    const db = new PouchDB('recitation_db', {adapter: 'asyncstorage'});
    db.get('team').then(function(doc) {
      let data = doc.data;
      data=data.filter(x=>x.archive===true)
      self.setState({
        dataSource: data === undefined ? [] : data,
        steps: dataSteps.steps,
      });
    });
  }
  static navigationOptions = ({navigation}) => {
    return {
      title: 'أرشيف الحلقات',
    };
  };
  handlerLongClick = () => {
    this._menu.show();
    //handler for Long Click
    //Alert.alert(' Button Long Pressed');
  };
  _menu = new Map();

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {};
  render() {
    return (
      <ImageBackground
        source={require('../images/bg.png')}
        style={{width: '100%', height: '100%'}}>
        <View style={{flex: 1}}>
          {/* <Button
          title="Go to Jane's profile"
          onPress={() =>
            this.props.navigation.dispatch(DrawerActions.toggleDrawer())
          }
        />*/}
          <View style={{height: 120}}>
            <ImageBackground
              source={require('../images/header.png')}
              style={{
                width: '100%',
                height: '100%',
                opacity: 0.85,
                flex: 1,
                flexDirection: 'row',
              }}>
              <Image
                style={{width: '50%', height: 120}}
                source={require('../images/logo.png')}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 31,
                  height: 120,
                  width: '50%',
                  paddingRight: '10%',
                  fontFamily: 'Amiri-Regular',
                }}>
                أرشيف الحلقات
              </Text>
            </ImageBackground>
          </View>
          <Overlay
            containerStyle={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
            isVisible={this.state.dialogIsVisible}
            windowBackgroundColor="rgba(255, 255, 255, 0.1)"
            overlayBackgroundColor="#8fc400"
            width="90%"
            height={250}>
            <View style={{height: 220}}>
              <ElementsText
                style={{
                  paddingRight: 10,
                  color: 'white',
                  fontFamily: 'Amiri-Regular',
                  fontSize: 20,
                  backgroundColor: '#3d4c29',
                }}>
                يرجى ادخال اسم الحلقة والمرحلة
              </ElementsText>
              <Input
                inputStyle={{textAlign: 'right', color: '#3d4c29'}}
                placeholder="إسم الحلقة"
                value={this.state.halakaName}
                onChangeText={name => {
                  this.setState({halakaName: name});
                }}
              />
              <Picker
                selectedValue={this.state.selected2}
                onValueChange={this.onValueChange2.bind(this)}
                enabled={this.state.halakaEditId === null}
                itemStyle={{textAlign: 'right', alignSelf: 'stretch', 
                alignItems:'center', 
                justifyContent:'center',}}
                style={{height: 50, width: 300}}>
                {this.state.steps.map(step => (
                  <Picker.Item  style={{justifyContent: 'flex-end'}} label={step.name} value={step.id} />
                ))}
              </Picker>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Button
                  buttonStyle={{
                    padding: 10,
                    margin: 10,
                    backgroundColor: '#3d4c29',
                  }}
                  onPress={() => {
                    const self = this;
                    const db = new PouchDB('recitation_db', {
                      adapter: 'asyncstorage',
                    });
                    db.get('team')
                      .then(function(doc) {
                        let data = doc.data;
                        if (data === undefined || data === null) {
                          data = [];
                        }
                        if (self.state.halakaEditId === null) {
                          data.push({
                            data_id: uuidv4(),
                            title: self.state.halakaName,
                            stepId: self.state.selected2,
                            archive: false,
                            username: 'hani@gmail.com',
                          });
                        } else if (self.state.halakaEditId !== null) {
                          data = data.map(h => {
                            if (h.data_id === self.state.halakaEditId) {
                              h.title = self.state.halakaName;
                            }
                            return h;
                          });
                        }
                        doc.data = data;
                        db.put(doc, function(err, resp) {
                          if (err) return;
                          doc._rev = resp.rev; //<--- wasn't updating revision here.
                        });
                        return data;
                      })
                      .then(response => {
                        self.setState({
                          dialogIsVisible: false,
                          dataSource: response,
                          halakaName: '',
                          selected2: '13',
                          halakaEditId: null,
                          halakaDeleteId: null,
                        });
                      });
                    //db.replicate.to('http://127.0.0.1:5984/recitation_db');
                  }}
                  title={'حفظ'}
                />
                <Button
                  buttonStyle={{
                    padding: 10,
                    margin: 10,
                    backgroundColor: '#3d4c29',
                  }}
                  onPress={() => {
                    this.setState({
                      dialogIsVisible: false,
                      halakaName: '',
                      selected2: '13',
                    });
                  }}
                  title={'إغلاق'}
                />
              </View>
            </View>
          </Overlay>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            {this.state.dataSource.map(item => (
              <TouchableHighlight
                style={{height: 180}}
                onLongPress={() => {
                  this._menu.get(item.data_id).show();
                }}
                onPress={() => {
                  this.props.navigation.navigate('Profile', {
                    itemId: item.data_id,
                    halakaName: item.title,
                  });
                }}>
                <View style={{height: 180}}>
                  <Menu
                    ref={ref => {
                      this._menu.set(item.data_id, ref);
                    }}
                    button={
                      <View
                        style={{
                          width: 150,
                          height: 170,
                          margin: 10,
                          color: 'white',
                        }}>
                        <ImageBackground
                          source={require('../images/halaka.png')}
                          style={{
                            width: '100%',
                            height: '100%',
                            opacity: 0.85,
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              paddingBottom: 20,
                              color: 'white',
                              fontSize: 16,
                            }}>
                            {item.title}
                          </Text>
                        </ImageBackground>
                      </View>
                    }>           
                    <MenuItem
                      onPress={() => {
                        const db = new PouchDB('recitation_db', {
                          adapter: 'asyncstorage',
                        });
                        db.get('team')
                          .then(function(doc) {
                            let data = doc.data;
                            if (data === undefined || data === null) {
                              data = [];
                            }

                            data = data.filter(h =>h.data_id !== item.data_id)

                            doc.data = data;
                            db.put(doc, function(err, resp) {
                              if (err) return;
                              doc._rev = resp.rev; //<--- wasn't updating revision here.
                            });
                            return data;
                          })
                          .then(response => {
                            response=response.filter(x=>x.archive===false)
                            self.setState(
                              {
                                dialogIsVisible: false,
                                dataSource: response,
                                halakaName: '',
                                selected2: '13',
                                halakaEditId: null,
                              });
                              self._menu.get(item.data_id).hide();
                              ToastAndroid.show('تم حذف الحلقة', ToastAndroid.SHORT);
                          });
                      }}>
                      حذف الحلقة نهائيا
                    </MenuItem>
                  </Menu>
                </View>
              </TouchableHighlight>
            ))}
          </ScrollView>         
        </View>
      </ImageBackground>
    );
  }
}
export default ArchiveScreen;
