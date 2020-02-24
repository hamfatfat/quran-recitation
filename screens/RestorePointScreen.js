/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Modal,
  ImageBackground,
  Image,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';
import PouchDB from 'pouchdb';
import {Button, Input} from 'react-native-elements';
import {Overlay, Text as ElementsText} from 'react-native-elements';
import {Icon, Fab, Form, Item} from 'native-base';
import {ToastAndroid} from 'react-native';
import {ListItem} from 'react-native-elements';

PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default);
var RNFS = require('react-native-fs');

const uuidv4 = require('uuid/v4');
class RestorePointScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      dialogIsVisible: false,
      dialogApplyRestoreIsVisible: false,
      pointName: '',
      dataSource: [],
      activePointId: null,
      filePath: null,
    };
  }
  componentDidMount() {
    const self = this;

    const restorePointdb = new PouchDB('recitation_restorepoint_db', {
      adapter: 'asyncstorage',
    });
    restorePointdb.get('restorePoint').then(function(doc) {
      let data = doc.data;
      self.setState({dataSource: data});
    });
  }
  componentDidUpdate() {
    const self = this;

    const restorePointdb = new PouchDB('recitation_restorepoint_db', {
      adapter: 'asyncstorage',
    });
    restorePointdb.get('restorePoint').then(function(doc) {
      let data = doc.data;
      self.setState({dataSource: data});
    });
  }
  static navigationOptions = {
    title: 'مزامنة البرنامج',
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({item}) => (
    <ListItem
      containerStyle={{
        padding: 10,
        color: 'white',
        textAlign: 'left',
        backgroundColor: '#3d4c29',
        opacity: 0.9,
      }}
      titleStyle={{color: 'white', textAlign: 'left'}}
      subtitleStyle={{color: 'white', textAlign: 'left'}}
      title={item.name}
      subtitle={item.date}
      friction={90} //
      tension={100} // These props are passed to the parent component (here TouchableScale)
      activeScale={0.95} //
      onPress={() => {
        this.setState({
          dialogApplyRestoreIsVisible: true,
          activePointId: item.data_id,
          filePath: item.path,
        });
      }}
      //leftAvatar={{ source: { uri: item.avatar_url } }}
      bottomDivider
      chevron
    />
  );

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
                  paddingRight: '5%',
                  textAlign: 'center',
                  fontFamily: 'Amiri-Regular',
                }}>
                النسخ الإحتياطي
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
            height={180}>
            <View style={{height: 180}}>
              <ElementsText
                style={{
                  paddingLeft: 10,
                  color: 'white',
                  fontFamily: 'Amiri-Regular',
                  fontSize: 20,
                  textAlign: 'left',
                  backgroundColor: '#3d4c29',
                }}>
                يرجى ادخال اسم النسخة
              </ElementsText>
              <Input
                inputStyle={{textAlign: 'right', color: '#3d4c29'}}
                placeholder="إسم النسخة"
                value={this.state.pointName}
                onChangeText={name => {
                  this.setState({pointName: name});
                }}
              />
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Button
                  buttonStyle={{
                    padding: 10,
                    margin: 10,
                    backgroundColor: '#3d4c29',
                  }}
                  onPress={() => {
                    const self = this;
                    if (this.state.pointName.length < 3) {
                      ToastAndroid.show(
                        'إسم النسخة يجب ان يتعدى الثلاثة أحرف',
                        ToastAndroid.SHORT,
                      );
                    } else {
                      var path =
                        RNFS.DocumentDirectoryPath +
                        '/' +
                        this.state.pointName +
                        '_' +
                        Date.now() +
                        '_' +
                        '.json';
                      const restorePointdb = new PouchDB(
                        'recitation_restorepoint_db',
                        {adapter: 'asyncstorage'},
                      );

                      const db = new PouchDB('recitation_db', {
                        adapter: 'asyncstorage',
                      });
                      db.get('team')
                        .then(function(docData) {
                          let allData = docData.data;
                          // write the file
                          return RNFS.writeFile(
                            path,
                            JSON.stringify(allData),
                            'utf8',
                          )
                            .then(success => {
                              restorePointdb
                                .get('restorePoint')
                                .then(function(doc) {
                                  let data = doc.data;
                                  if (data === undefined || data === null) {
                                    data = [];
                                  }

                                  data.push({
                                    data_id: uuidv4(),
                                    name: self.state.pointName,
                                    path: path,
                                    date: new Date().toLocaleString('en-US', {
                                      hour12: false,
                                    }),
                                  });

                                  doc.data = data;
                                  restorePointdb.put(doc, function(err, resp) {
                                    if (err) return;
                                    doc._rev = resp.rev; //<--- wasn't updating revision here.
                                  });
                                  return data;
                                })
                                .then(response => {
                                  self.setState({
                                    dialogIsVisible: false,
                                    dataSource: response,
                                    pointName: '',
                                  });

                                  ToastAndroid.show(
                                    'تم الحفظ',
                                    ToastAndroid.SHORT,
                                  );
                                });
                            })
                            .catch(err => {
                              console.log(err.message);
                            });
                        })
                        .then(res => console.log(res));
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
                      pointName: '',
                      selected2: '13',
                    });
                  }}
                  title={'إغلاق'}
                />
              </View>
            </View>
          </Overlay>
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
            isVisible={this.state.dialogApplyRestoreIsVisible}
            windowBackgroundColor="rgba(255, 255, 255, 0.1)"
            overlayBackgroundColor="#8fc400"
            width="90%"
            height={180}>
            <View style={{height: 180}}>
              <ElementsText
                style={{
                  paddingLeft: 10,
                  textAlign: 'left',
                  color: 'white',
                  fontFamily: 'Amiri-Regular',
                  fontSize: 20,
                  backgroundColor: '#3d4c29',
                }}>
                سيتم إعادة البرنامج لهذا التاريخ. سيتم حذف جميع البيانات الحالية
                يرجى أخد نسخة بتاريخ اليوم
              </ElementsText>
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
                        return db.remove(doc._id, doc._rev);
                      })
                      .then(res => {
                        db.put({_id: 'team'});
                        // get a list of files and directories in the main bundle
                        RNFS.readFile(self.state.filePath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
                          .then(result => {
                            const data = JSON.parse(result);
                            return data;
                          })
                          .then(jsonData => {
                            db.get('team').then(function(doc) {
                              doc.data = jsonData;
                              db.put(doc, function(err, resp) {
                                if (err) return;
                                doc._rev = resp.rev; //<--- wasn't updating revision here.
                              }).then(res => {
                                self.setState({
                                  dialogApplyRestoreIsVisible: false,
                                  activePointId: null,
                                  filePath: null,
                                });

                                ToastAndroid.show(
                                  'تمت العملية',
                                  ToastAndroid.SHORT,
                                );
                              });
                            });
                          })
                          .catch(err => {
                            console.log(err.message, err.code);
                          });
                      });
                    //db.replicate.to('http://127.0.0.1:5984/recitation_db');
                  }}
                  title={'إعادة ضبط البيانات لهذا التاريخ'}
                />
                <Button
                  buttonStyle={{
                    padding: 10,
                    margin: 10,
                    backgroundColor: '#3d4c29',
                  }}
                  onPress={() => {
                    this.setState({
                      dialogApplyRestoreIsVisible: false,
                      activePointId: null,
                      filePath: null,
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
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.dataSource}
              renderItem={this.renderItem}
            />
          </ScrollView>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{backgroundColor: '#3d4c29'}}
            position="bottomRight"
            onPress={() =>
              this.setState({
                dialogIsVisible: true,
              })
            }>
            <Icon name="add" />
          </Fab>
        </View>
      </ImageBackground>
    );
  }
}
export default RestorePointScreen;
