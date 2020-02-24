/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, View, ScrollView, TouchableHighlight, Text} from 'react-native';
import {Button} from 'react-native-elements';
import {Icon, Fab, Picker} from 'native-base';
import {Overlay, Text as ElementsText} from 'react-native-elements';
import {Input} from 'react-native-elements';
import {ImageBackground} from 'react-native';
import PouchDB from 'pouchdb';
import * as dataSteps from '../data/configuration.json';
import Menu, {MenuItem} from 'react-native-material-menu';
import Modal, {ModalContent} from 'react-native-modals';
PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default);
const uuidv4 = require('uuid/v4');

class HomeScreen extends React.Component {
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
  onValueChange2(value) {
    this.setState({
      selected2: value,
    });
  }
  async componentDidMount() {
    // try {
    const self = this;
    const db = new PouchDB('recitation_db', {adapter: 'asyncstorage'});
    db.get('team').then(function(doc) {
      let data = doc.data;
      data = data === undefined ? [] : data;
      data = data.filter(x => x.archive === false);
      self.setState({
        dataSource: data === undefined ? [] : data.slice().reverse(),
        steps: dataSteps.steps,
      });
    });
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      const self = this;
      const dbb = new PouchDB('recitation_db', {adapter: 'asyncstorage'});
      dbb.get('team').then(function(doc) {
        let data = doc.data;
        data = data === undefined ? [] : data;
        data = data.filter(x => x.archive === false);
        self.setState({
          dataSource: data === undefined ? [] : data.slice().reverse(),
          steps: dataSteps.steps,
        });
      });
    });
  }
  componentWillUnmount() {
    // Remove the event listener before removing the screen from the stack
    this.focusListener.remove();
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
      data = data === undefined ? [] : data;
      data = data.filter(x => x.archive === false);
      self.setState({
        dataSource: data === undefined ? [] : data.slice().reverse(),
        steps: dataSteps.steps,
      });
    });
  }
  static navigationOptions = ({navigation}) => {
    return {
      title: 'اٍدارة الحلقات',
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
          <View
            style={{
              height: 120,
            }}>
            <ImageBackground
              source={require('../images/header.png')}
              style={{
                width: '100%',
                height: '100%',
                opacity: 0.85,
                justifyContent: 'center',
                alignItems: 'center',
                textAlignVertical: 'center',
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
                  fontSize: 40,
                  width: '50%',
                  height: 120,
                  paddingTop: 20,
                  alignSelf: 'center',
                  paddingRight: '10%',
                  fontFamily: 'Amiri-Regular',
                }}>
                الحلقات
              </Text>
            </ImageBackground>
          </View>
          {/*<Overlay
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
            windowBackgroundColor="rgb(255, 255, 255)"
            overlayBackgroundColor="#8fc400"
            width="90%"
          >*/}
          <Modal
            height={250}
            visible={this.state.dialogIsVisible}
            backgroundStyle={{}}
            overlayOpacity={0.1}
            modalStyle={{
              padding: 0,
              margin: 0,
              backgroundColor: '#8fc400',
            }}
            onTouchOutside={() => {
              this.setState({dialogIsVisible: false});
            }}>
            <ModalContent>
              <View style={{height: 220, textAlign: 'right'}}>
                <ElementsText
                  style={{
                    width: '100%',
                    paddingLeft: 10,
                    textAlign: 'left',
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
                  // selectedValue={this.state.selected2}
                  onValueChange={this.onValueChange2.bind(this)}
                  selectedValue={this.state.selected2}
                  enabled={this.state.halakaEditId === null}
                  itemStyle={{
                    textAlign: 'right',
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  style={{height: 50, width: 300}}>
                  {dataSteps.steps.map(step => (
                    <Picker.Item
                      label={step.name + ' الأجزاء ' + step.chapters}
                      value={step.id + ''}
                    />
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
                      if (this.state.halakaName.length < 3) {
                        /*ToastAndroid.show(
                            'إسم الحلقة يجب ان يتعدى الثلاثة أحرف',
                            ToastAndroid.SHORT,
                          );*/
                      } else {
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
                              dataSource: response.slice().reverse(),
                              halakaName: '',
                              selected2: '13',
                              halakaEditId: null,
                              halakaDeleteId: null,
                            });

                            //ToastAndroid.show('تم الحفظ', ToastAndroid.SHORT);
                          });
                      }
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
            </ModalContent>
          </Modal>
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
                        this.setState({
                          dialogIsVisible: true,
                          halakaName: item.title,
                          selected2: item.stepId,
                          halakaEditId: item.data_id,
                        });
                        this._menu.get(item.data_id).hide();
                      }}>
                      تعديل الحلقة
                    </MenuItem>
                    <MenuItem
                      onPress={() => {
                        const db = new PouchDB('recitation_db', {
                          adapter: 'asyncstorage',
                        });
                        const self = this;
                        self._menu.get(item.data_id).hide();
                        db.get('team')
                          .then(function(doc) {
                            let data = doc.data;
                            if (data === undefined || data === null) {
                              data = [];
                            }

                            data = data.map(h => {
                              if (h.data_id === item.data_id) {
                                h.archive = true;
                              }
                              return h;
                            });

                            doc.data = data;
                            db.put(doc, function(err, resp) {
                              if (err) return;
                              doc._rev = resp.rev; //<--- wasn't updating revision here.
                            });
                            return data;
                          })
                          .then(response => {
                            response = response.filter(
                              x => x.archive === false,
                            );
                            self.setState(
                              {
                                dialogIsVisible: false,
                                dataSource: response.slice().reverse(),
                                halakaName: '',
                                selected2: '13',
                                halakaEditId: null,
                              },
                              () => {
                                /* ToastAndroid.show(
                                    'تم نقل الحلقة الى الأرشيف',
                                    ToastAndroid.SHORT,
                                  );*/
                              },
                            );
                          });
                      }}>
                      حذف الحلقة
                    </MenuItem>
                  </Menu>
                </View>
              </TouchableHighlight>
            ))}
          </ScrollView>
          {!this.state.showDashboard && (
            <Fab
              //active={this.state.active}
              direction="up"
              containerStyle={{}}
              style={{backgroundColor: '#3d4c29'}}
              position="bottomRight"
              onPress={() =>
                this.setState({
                  active: !this.state.active,
                  dialogIsVisible: true,
                  halakaEditId: null,
                })
              }>
              <Icon name="add" />
            </Fab>
          )}
        </View>
      </ImageBackground>
    );
  }
}
export default HomeScreen;
