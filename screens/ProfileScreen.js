/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  TouchableHighlight,
  Text,
} from 'react-native';
import {Button} from 'react-native-elements';

import {Overlay, Text as ElementsText} from 'react-native-elements';
import {Input} from 'react-native-elements';

import Modal, {ModalContent} from 'react-native-modals';
import {ToastAndroid} from 'react-native';
import {Icon, Fab, Form, Item, Picker} from 'native-base';
import {ImageBackground} from 'react-native';
import PouchDB from 'pouchdb';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default);
const uuidv4 = require('uuid/v4');
const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});
class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      active: false,
      isLoading: true,
      dialogIsVisible: false,
      dialogStudentNewStepIsVisible: false,
      selected2: undefined,
      selectedStudentNextStep2: undefined,
      halakaName: '',
      selectedStudentId: null,
      halakaList: [],
    };
  }
  onValueChange2(value) {
    this.setState({
      selected2: value,
    });
  }
  onValueStudentNextStepChange2(value) {
    this.setState({
      selectedStudentNextStep2: value,
    });
  }
  async componentDidMount() {
    const db = new PouchDB('recitation_db', {adapter: 'asyncstorage'});
    const self = this;
    const halakaList = [];
    db.get('team').then(function(doc) {
      let data = doc.data;
      if (data === undefined || data === null) {
        data = [];
      }
      data.forEach(halaka => {
        if (halaka.archive === false) halakaList.push(halaka);
        if (halaka.data_id === self.props.route.params.itemId) {
          if (halaka.user === undefined) {
            halaka.user = [];
          }
          self.setState({
            dataSource: halaka.user
              .sort((a, b) => (a.studentName < b.studentName ? 1 : -1))
              .filter(x => x.archive === false),
          });
        }
      });
    });
    self.setState({halakaList});
    //db.replicate.to('http://127.0.0.1:5984/recitation_db');
    /* try {
      const responseJson = await recitationCentersById(
        JSON.stringify(navigation.getParam('itemId', 'NO-ID')),
      );
      this.setState(
        {
          isLoading: false,
          dataSource: responseJson.users,
        },
        function() {},
      );
    } catch (error) {
      console.error(error);
    }*/
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.route.params.itemId !== this.props.route.params.itemId) {
      const self = this;
      const halakaList = [];
      const {navigation} = this.props;
      const db = new PouchDB('recitation_db', {adapter: 'asyncstorage'});
      db.get('team').then(function(doc) {
        let data = doc.data;
        if (data === undefined || data === null) {
          data = [];
        }
        data.forEach(halaka => {
          if (halaka.archive === false) halakaList.push(halaka);
          if (halaka.data_id === self.props.route.params.itemId) {
            if (halaka.user === undefined) {
              halaka.user = [];
            }
            self.setState({
              dataSource: halaka.user
                .sort((a, b) => (a.studentName < b.studentName ? 1 : -1))
                .filter(x => x.archive === false),
            });
          }
        });
      });
      self.setState({halakaList});
      /* try {
        const responseJson = await recitationCentersById(
          JSON.stringify(navigation.getParam('itemId', 'NO-ID')),
        );
        this.setState(
          {
            isLoading: false,
            dataSource: responseJson.users,
          },
          function() {},
        );
      } catch (error) {
        console.error(error);
      }*/
    }
  }
  static navigationOptions = {
    title: 'اٍدارة الطلاب',
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
  render() {
    return (
      <ImageBackground
        source={require('../images/bg.png')}
        style={{width: '100%', height: '100%'}}>
        <View style={{flex: 1}}>
          {/*<Button
          title="Go to Jane's profile"
          onPress={() => navigate('Home', {name: 'Jane'})}
        />*/}
          <View style={{height: 120}}>
            <ImageBackground
              source={require('../images/header.png')}
              style={{
                width: '100%',
                height: '100%',
                opacity: 0.9,
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
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  width: '50%',
                  paddingTop: 10,
                  height: 120,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 30,
                    textAlign: 'center',
                    height: 70,
                    paddingRight: '10%',
                    fontFamily: 'Amiri-Regular',
                  }}>
                  الطلاب
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    textAlign: 'center',
                    paddingLeft: 5,
                    fontFamily: 'Amiri-Regular',
                  }}>
                  {`${this.props.route.params['halakaName']}`}
                </Text>
              </View>
            </ImageBackground>
          </View>
          <Modal
            height={180}
            width={0.9}
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
              <View style={{height: 150}}>
                <ElementsText
                  style={{
                    paddingLeft: 10,
                    color: 'white',
                    textAlign: 'left',
                    fontFamily: 'Amiri-Regular',
                    fontSize: 20,
                    backgroundColor: '#3d4c29',
                  }}>
                  يرجى ادخال اسم الطالب
                </ElementsText>
                <Input
                  inputStyle={{textAlign: 'right', color: '#3d4c29'}}
                  placeholder="إسم الطالب"
                  value={this.state.halakaName}
                  onChangeText={name => {
                    this.setState({halakaName: name});
                  }}
                />
                {/*<Picker
              selectedValue={this.state.selected2}
              onValueChange={this.onValueChange2.bind(this)}
              style={{height: 50, width: 300}}>
              {this.state.steps.map(step => (
                <Picker.Item label={step.name} value={step.id} />
              ))}
              </Picker>*/}
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
                        ToastAndroid.show(
                          'إسم الطالب يجب ان يتعدى الثلاثة أحرف',
                          ToastAndroid.SHORT,
                        );
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
                            let users = [];
                            data.map(halaka => {
                              if (
                                halaka.data_id ===
                                self.props.route.params.itemId
                              ) {
                                if (halaka.user === undefined) {
                                  halaka.user = [];
                                }
                                halaka.user.push({
                                  data_id: uuidv4(),
                                  studentName: self.state.halakaName,
                                  archive: false,
                                });
                                users = halaka.user;

                                return halaka;
                              }
                            });

                            doc.data = data;
                            db.put(doc, function(err, resp) {
                              if (err) return;
                              doc._rev = resp.rev; //<--- wasn't updating revision here.
                            });
                            return users;
                          })
                          .then(response => {
                            self.setState({
                              dialogIsVisible: false,
                              dialogStudentNewStepIsVisible: false,
                              dataSource: response
                                .sort((a, b) =>
                                  a.studentName < b.studentName ? 1 : -1,
                                )
                                .filter(x => x.archive === false),
                              halakaName: '',
                            });
                            ToastAndroid.show('تمت الحفظ', ToastAndroid.SHORT);
                          });
                      }
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
                      this.setState({dialogIsVisible: false});
                    }}
                    title={'إغلاق'}
                  />
                </View>
              </View>
            </ModalContent>
          </Modal>
          <Modal
            height={180}
            width={0.9}
            visible={this.state.dialogStudentNewStepIsVisible}
            backgroundStyle={{}}
            overlayOpacity={0.1}
            modalStyle={{
              padding: 0,
              margin: 0,
              backgroundColor: '#8fc400',
            }}
            onTouchOutside={() => {
              this.setState({dialogStudentNewStepIsVisible: false});
            }}>
            <ModalContent>
              <View style={{height: 150}}>
                <ElementsText
                  style={{
                    paddingRight: 10,
                    color: 'white',
                    fontFamily: 'Amiri-Regular',
                    fontSize: 20,
                    backgroundColor: '#3d4c29',
                  }}>
                  يرجى اختيار الحلقة الجديدة
                </ElementsText>
                <Picker
                  placeholder="إضغط لاختيار الحلقة"
                  placeholderStyle={{color: '#3d4c29'}}
                  selectedValue={this.state.selectedStudentNextStep2}
                  onValueChange={this.onValueStudentNextStepChange2.bind(this)}
                  style={{height: 50, width: 300}}>
                  {this.state.halakaList.map(step => (
                    <Picker.Item label={step.title} value={step.data_id} />
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
                          let users = [];
                          data.map(halaka => {
                            if (
                              halaka.data_id ===
                              self.state.selectedStudentNextStep2
                            ) {
                              if (halaka.user === undefined) {
                                halaka.user = [];
                              }
                              const testExisting = halaka.user.find(
                                x => x.data_id === self.state.selectedStudentId,
                              );
                              if (
                                testExisting === undefined ||
                                testExisting === null
                              ) {
                                halaka.user.push({
                                  data_id: self.state.selectedStudentId,
                                  studentName: self.state.selectedStudentName,
                                  archive: false,
                                });
                              }
                              users = halaka.user;

                              return halaka;
                            }
                          });

                          doc.data = data;
                          db.put(doc, function(err, resp) {
                            if (err) return;
                            doc._rev = resp.rev; //<--- wasn't updating revision here.
                          });
                          return users;
                        })
                        .then(response => {
                          self.setState({
                            dialogIsVisible: false,
                            dialogStudentNewStepIsVisible: false,
                            /* dataSource: response.filter(
                              x => x.archive === false,
                            ),*/
                            halakaName: '',
                          });

                          ToastAndroid.show('تم الحفظ', ToastAndroid.SHORT);
                        });
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
                      this.setState({dialogStudentNewStepIsVisible: false});
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
              flexDirection: 'row-reverse',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            {this.state.dataSource.map(item => (
              <TouchableHighlight
                onLongPress={() => {
                  this._menu.get(item.data_id).show();
                }}
                onPress={() => {
                  const db = new PouchDB('recitation_db', {
                    adapter: 'asyncstorage',
                  });
                  const self = this;
                  db.get('team').then(function(doc) {
                    let data = doc.data;
                    if (data === undefined || data === null) {
                      data = [];
                    }
                    data.forEach(halaka => {
                      if (halaka.data_id === self.props.route.params.itemId) {
                        self.props.navigation.navigate('Revision', {
                          itemId: halaka.stepId,
                          halakaId: halaka.data_id,
                          userId: item.data_id,
                          studentName: item.studentName,
                        });
                      }
                    });
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
                            {item.studentName}
                          </Text>
                        </ImageBackground>
                      </View>
                    }>
                    <MenuItem
                      onPress={() => {
                        this._menu.get(item.data_id).hide();
                        this.setState({
                          dialogStudentNewStepIsVisible: true,
                          selectedStudentId: item.data_id,
                          selectedStudentName: item.studentName,
                        });
                      }}>
                      ترفيع الطالب الى حلقة جديدة
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
                            let users = [];
                            let data = doc.data;
                            if (data === undefined || data === null) {
                              data = [];
                            }

                            data = data.map(h => {
                              if (
                                h.user !== undefined &&
                                h.data_id === self.props.route.params.itemId
                              ) {
                                h.user = h.user.map(x => {
                                  if (x.data_id === item.data_id) {
                                    x.archive = true;
                                  }
                                  return x;
                                });
                                users = h.user;
                              }
                              return h;
                            });

                            doc.data = data;
                            db.put(doc, function(err, resp) {
                              if (err) return;
                              doc._rev = resp.rev; //<--- wasn't updating revision here.
                            });
                            return users;
                          })
                          .then(response => {
                            self.setState({
                              dialogIsVisible: false,
                              dialogStudentNewStepIsVisible: false,
                              dataSource: response
                                .sort((a, b) =>
                                  a.studentName < b.studentName ? 1 : -1,
                                )
                                .filter(x => x.archive === false),
                              halakaName: '',
                            });
                            ToastAndroid.show(
                              'تمت العملية',
                              ToastAndroid.SHORT,
                            );
                          });
                      }}>
                      حذف الطالب
                    </MenuItem>
                  </Menu>
                </View>
              </TouchableHighlight>
            ))}
          </ScrollView>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{backgroundColor: '#3d4c29'}}
            position="bottomRight"
            onPress={() =>
              this.setState({active: !this.state.active, dialogIsVisible: true})
            }>
            <Icon name="add" />
          </Fab>
        </View>
      </ImageBackground>
    );
  }
}
export default ProfileScreen;
