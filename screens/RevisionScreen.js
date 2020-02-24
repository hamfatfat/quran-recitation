/* eslint-disable react-native/no-inline-styles */
import React, {createRef} from 'react';
import {Image, StyleSheet, View, Text, ScrollView} from 'react-native';
import {Picker, Icon as NativeBaseIcon} from 'native-base';

import RNPickerSelect from 'react-native-picker-select';
import {ImageBackground} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as data from '../data/steps.json';
import * as quran from '../data/quran.json';
import PouchDB from 'pouchdb';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Overlay} from 'react-native-elements';
PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default);
const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  viewPager: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progress: {
    //  backgroundColor: 'black',
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
  buttonText: {
    // color: 'white',
  },
  scrollStateText: {
    color: 'black',
  },
});
class RevisionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      dataSource: [],
      isLoading: true,
      checked: false,
      schedules: [],
      revisions: [],
      studentProgress: [],
      dialogIsVisible: false,
      selectedRevisionNumber: null,
      progress: {
        position: 0,
        offset: 0,
      },
    };
    this.viewPager = createRef();
    // this.renderRow = this.renderRow.bind(this);
  }
  onPageScroll = e => {
    const self = this;
    // setTimeout(() => {

    // }, 50);

    this.setState({
      progress: {
        position: e.nativeEvent.position,
        offset: e.nativeEvent.offset,
      },
    });
  };
  onPageSelected = e => {
    this.setState({
      page: e.nativeEvent.position,
    });
  };
  componentDidMount() {
    const {route} = this.props;
    //  this.props.getSteps(JSON.stringify(navigation.getParam('itemId', 'NO-ID')));
    //const self = this;
    //const db = new PouchDB('recitation_db');
    //db.get('steps')
    //  .then(doc => {
    const steps = data.steps;
    const selectedStep = steps
      ? steps.find(x => x.id + '' === route.params.itemId + '')
      : null;
    if (selectedStep !== null) {
      this.setState({
        schedules: selectedStep.schedule,
        revisions: selectedStep.revision,
      });
    } else {
      this.setState({
        schedules: [],
        revisions: [],
      });
    }
    this.loadStudentProgress(0);
    // })
    //.then(response => {
    //  self.setState({
    //    schedules: response,
    //  });
    //});
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.route.params.halakaId !== this.props.route.params.halakaId) {
      const {route} = this.props;
      const steps = data.steps;
      const selectedStep = steps
        ? steps.find(x => x.id + '' === route.params.itemId + '')
        : null;
      if (selectedStep !== null) {
        this.setState({
          schedules: selectedStep.schedule,
          revisions: selectedStep.revision,
        });
      } else {
        this.setState({
          schedules: [],
          revisions: [],
        });
      }
      this.loadStudentProgress(0);
    }
  }
  static navigationOptions = {
    title: 'التسميع',
  };
  move = delta => {
    const page = this.state.page + delta;
    if (page >= 0 && page <= this.state.schedules.length - 1) {
      this.loadStudentProgress(page);
    }
  };
  loadStudentProgress = page => {
    const self = this;
    const db = new PouchDB('recitation_db', {adapter: 'asyncstorage'});
    db.get('team')
      .then(doc => {
        let data = doc.data;
        let studentProgress = [];
        if (data === undefined || data === null) {
          data = [];
        }
        data.forEach(halaka => {
          halaka.user &&
            halaka.user.forEach(user => {
              if (
                halaka.data_id === self.props.route.params.halakaId &&
                user.data_id === self.props.route.params.userId
              ) {
                studentProgress = user.studentProgress;
              }
            });
        });
        return studentProgress;
      })
      .then(response => {
        self.setState({
          studentProgress: response,
          page,
        });
      });
  };

  go = page => {
    //  if (this.state.animationsAreEnabled) {
    /* $FlowFixMe we need to update flow to support React.Ref and createRef() */
    this.loadStudentProgress(page);
    //  } else {
    /* $FlowFixMe we need to update flow to support React.Ref and createRef() */
    //this.viewPager.current.setPageWithoutAnimation(page);
    //}
  };

  render() {
    const {navigate} = this.props.navigation;
    const item =
      this.state.schedules.length > 0
        ? this.state.schedules[this.state.page]
        : null;
    const revisions = this.state.revisions;
    return (
      <ImageBackground
        source={require('../images/bg.png')}
        style={{width: '100%', height: '100%'}}>
        <View
          style={{
            flex: 1,
          }}>
          <View style={{height: 120}}>
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
              height={350}>
              <View style={{height: 340}}>
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                  }}>
                  {this.state.revisions
                    .filter(
                      x =>
                        x.alias_step_id + '' ===
                        this.state.selectedRevisionNumber,
                    )
                    .map(rev => (
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: '#3d4c29',
                          color: 'white',
                          justifyContent: 'center',
                          alignSelf: 'stretch',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flex: 1,
                            alignSelf: 'center',
                            textAlign: 'center',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: 'white',
                              fontSize: 14,
                              fontFamily: 'Amiri-Regular',
                            }}>
                            {rev.alias_step_id}
                          </Text>
                        </View>
                        <View style={{flex: 1}}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: 'white',
                              fontSize: 14,
                              fontFamily: 'Amiri-Regular',
                            }}>
                            {rev.name}
                          </Text>
                        </View>
                        <View style={{flex: 1}}>
                          <Button
                            buttonStyle={{
                              marginTop: 5,
                              backgroundColor: '#3d4c29',
                            }}
                            onPress={() => {
                              let name = rev.name;
                              if (name.indexOf('الحزب 61') > -1) {
                                this.props.navigation.navigate('Recitation', {
                                  toAya: 1,
                                  souraID: 103,
                                  soura: 'سورة العصر',
                                });
                                this.setState({dialogIsVisible: false});
                              } else {
                                const aya = quran.data.filter(
                                  x => x.QuardJuzaaText === name,
                                );
                                if (aya.length > 0) {
                                  this.props.navigation.navigate('Recitation', {
                                    toAya: aya[0].VerseID,
                                    souraID: aya[0].SuraID,
                                    soura: aya[0].suraName,
                                  });
                                  this.setState({dialogIsVisible: false});
                                }
                              }
                            }}
                            icon={<Icon name="send" size={15} color="white" />}
                          />
                        </View>
                      </View>
                    ))}
                </ScrollView>
                <Button
                  buttonStyle={{
                    marginTop: 5,
                    backgroundColor: '#3d4c29',
                  }}
                  onPress={() => {
                    this.setState({dialogIsVisible: false});
                  }}
                  title={'إغلاق'}
                />
              </View>
            </Overlay>
            <ImageBackground
              source={require('../images/header.png')}
              style={{
                width: '100%',
                height: '100%',
                opacity: 0.9,
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
                  {`الطالب`}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    paddingLeft: 5,
                    textAlign: 'center',
                    fontFamily: 'Amiri-Regular',
                  }}>
                  {`${this.props.route.params['studentName']}`}
                </Text>
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              // backgroundColor: 'powderblue',
              padding: 10,
              flexDirection: 'column',
              flex: 1,
              // color: 'white',
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#3d4c29',
                color: 'white',
                justifyContent: 'center',
                alignSelf: 'stretch',
                alignItems: 'center',
              }}>
              <Button
                type="clear"
                icon={
                  <Icon name="angle-double-right" size={25} color="white" />
                }
                enabled={this.state.page > 0}
                onPress={() => this.go(0)}
              />
              <Button
                type="clear"
                icon={<Icon name="angle-right" size={25} color="white" />}
                enabled={this.state.page > 0}
                onPress={() => this.move(-1)}
              />
              <View
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  textAlign: 'center',
                }}>
                <Picker
                  style={{width: '80%', marginLeft: 10, color: 'white'}}
                  textStyle={{color: 'white'}}
                  iosIcon={<NativeBaseIcon name="arrow-down" />}
                  placeholderIconColor="#007aff"
                  placeholderStyle={{color: '#bfc6ea'}}
                  selectedValue={this.state.page}
                  onValueChange={name => {
                    this.setState({page: name});
                  }}>
                  {this.state.schedules.map((x, idx) => (
                    <Picker.Item label={x.name} value={idx} />
                  ))}
                </Picker>
              </View>
              <Button
                type="clear"
                icon={<Icon name="angle-left" size={25} color="white" />}
                enabled={this.state.page < this.state.schedules.length - 1}
                onPress={() => this.move(1)}
              />
              <Button
                type="clear"
                icon={<Icon name="angle-double-left" size={25} color="white" />}
                enabled={this.state.page < this.state.schedules.length - 1}
                onPress={() => this.go(this.state.schedules.length - 1)}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#3d4c29',
                color: 'white',
                justifyContent: 'center',
                alignSelf: 'stretch',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  textAlign: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Amiri-Regular',
                  }}>
                  رقم المراجعة
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Amiri-Regular',
                  }}>
                  السورة
                </Text>
              </View>
              <View style={{flex: 1, textAlign: 'center'}}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Amiri-Regular',
                  }}>
                  للاية
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Amiri-Regular',
                  }}>
                  ع. ح.
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Amiri-Regular',
                  }}>
                  ع. م.
                </Text>
              </View>
            </View>
            {item &&
              item.recitationstep.map((itemstep, idx) => {
                const studentProgressData = this.state.studentProgress;
                const testExistingStudentProgress =
                  studentProgressData !== undefined
                    ? studentProgressData.find(
                        x => x.recitationstep_id === itemstep.id,
                      )
                    : null;
                let saveChecked = null;
                let reviewChecked = null;
                if (
                  testExistingStudentProgress !== undefined &&
                  testExistingStudentProgress !== null
                ) {
                  saveChecked = testExistingStudentProgress.save_flag;
                  reviewChecked = testExistingStudentProgress.review_flag;
                }
                return (
                  <View
                    style={{
                      flex: 1,
                      height: 500,
                      flexDirection: 'row',
                      backgroundColor: idx % 2 === 0 ? '#eaf8e6' : 'white',
                      color: 'white',
                      justifyContent: 'center',
                      alignSelf: 'stretch',
                      alignItems: 'center',
                    }}>
                    <View style={{flex: 1, textAlign: 'center'}}>
                      <TouchableHighlight
                        style={{
                          //backgroundColor: '#5a6639',
                          color: 'white',
                          borderRadius: 15,
                          paddingLeft: 5,
                          margin: 10,
                        }}
                        onPress={() => {
                          if (
                            itemstep.alias_step_id.indexOf('المقرر كاملا') ===
                            -1
                          ) {
                            this.setState({
                              dialogIsVisible: true,
                              selectedRevisionNumber: itemstep.alias_step_id,
                            });
                          }
                        }}>
                        <Text style={{textAlign: 'center'}}>
                          {itemstep.alias_step_id}
                        </Text>
                      </TouchableHighlight>
                    </View>
                    <View style={{flex: 1}}>
                      <TouchableHighlight
                        style={{
                          //backgroundColor: '#5a6639',
                          color: 'white',
                          borderRadius: 15,
                          paddingLeft: 5,
                          margin: 10,
                        }}
                        onPress={() => {
                          if (itemstep.soura.indexOf('المقرر كاملا') === -1) {
                            this.props.navigation.navigate('Recitation', {
                              toAya: itemstep.toAya,
                              souraID: itemstep.souraID,
                              soura: itemstep.soura,
                            });
                          }
                        }}>
                        <Text style={{textAlign: 'center'}}>
                          {itemstep.soura}
                        </Text>
                      </TouchableHighlight>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignSelf: 'center',
                        textAlign: 'center',
                      }}>
                      <Text style={{textAlign: 'center'}}>
                        {itemstep.toAya}
                      </Text>
                    </View>
                    <View
                      style={{flex: 1, alignItems: 'center'}}
                      key={`save${itemstep.id}`}>
                      <Picker
                        style={{
                          textAlign: 'center',
                          width: '95%',
                        }}
                        iosIcon={<NativeBaseIcon name="arrow-down" />}
                        placeholderIconColor="#007aff"
                        placeholderStyle={{color: '#bfc6ea'}}
                        key={`savePicker${itemstep.id}`}
                        selectedValue={saveChecked + ''}
                        onValueChange={name => {
                          const db = new PouchDB('recitation_db', {
                            adapter: 'asyncstorage',
                          });
                          const self = this;
                          //setTimeout(() => {
                          db.get('team')
                            .then(doc => {
                              let responseData = [];
                              let data = doc.data;
                              if (data === undefined || data === null) {
                                data = [];
                              }
                              data = data.map(halaka => {
                                halaka.user !== undefined &&
                                  halaka.user.map(user => {
                                    if (
                                      halaka.data_id ===
                                        self.props.route.params.halakaId &&
                                      user.data_id ===
                                        self.props.route.params.userId
                                    ) {
                                      let studentProgress =
                                        user.studentProgress;
                                      if (
                                        studentProgress === undefined ||
                                        studentProgress === null
                                      ) {
                                        studentProgress = [];
                                      }
                                      const existingStudentProgress = studentProgress.find(
                                        x =>
                                          x.recitationstep_id === itemstep.id,
                                      );
                                      if (
                                        existingStudentProgress !== undefined &&
                                        existingStudentProgress !== null
                                      ) {
                                        existingStudentProgress.save_flag = name;
                                      } else {
                                        const newStudentProgress = {
                                          recitationstep_id: itemstep.id,
                                          save_flag: name,
                                          review_flag: null,
                                        };
                                        studentProgress.push(
                                          newStudentProgress,
                                        );
                                      }
                                      responseData = studentProgress;
                                      user.studentProgress = studentProgress;
                                    }
                                    return user;
                                  });
                                return halaka;
                              });
                              doc.data = data;
                              db.put(doc);
                              return responseData;
                            })
                            .then(response => {
                              self.setState({
                                studentProgress: response,
                              });
                            });
                          //}, 50);
                        }}>
                        {[
                          '0',
                          '1',
                          '2',
                          '3',
                          '4',
                          '5',
                          '6',
                          '7',
                          '8',
                          '9',
                          '10',
                          '11',
                          '12',
                          '13',
                          '14',
                          '15',
                          '16',
                          '17',
                          '18',
                          '19',
                          '20',
                        ].map(step => (
                          <Picker.Item label={step + ''} value={step} />
                        ))}
                      </Picker>
                    </View>
                    <View
                      style={{flex: 1, alignItems: 'center'}}
                      key={`review${itemstep.id}`}>
                      <Picker
                        style={{
                          textAlign: 'center',
                          width: '95%',
                        }}
                        iosIcon={<NativeBaseIcon name="arrow-down" />}
                        placeholderIconColor="#007aff"
                        placeholderStyle={{color: '#bfc6ea'}}
                        key={`reviewPicker${itemstep.id}`}
                        selectedValue={reviewChecked + ''}
                        onValueChange={name => {
                          const db = new PouchDB('recitation_db', {
                            adapter: 'asyncstorage',
                          });
                          const self = this;

                          //setTimeout(() => {
                          db.get('team')
                            .then(doc => {
                              let data = doc.data;
                              let responseData = [];
                              if (data === undefined || data === null) {
                                data = [];
                              }
                              data.map(halaka => {
                                halaka.user !== undefined &&
                                  halaka.user.map(user => {
                                    if (
                                      halaka.data_id ===
                                        self.props.route.params.halakaId &&
                                      user.data_id ===
                                        self.props.route.params.userId
                                    ) {
                                      let studentProgress =
                                        user.studentProgress;
                                      if (
                                        studentProgress === undefined ||
                                        studentProgress === null
                                      ) {
                                        studentProgress = [];
                                      }
                                      const existingStudentProgress = studentProgress.find(
                                        x =>
                                          x.recitationstep_id === itemstep.id,
                                      );
                                      if (
                                        existingStudentProgress !== undefined &&
                                        existingStudentProgress !== null
                                      ) {
                                        existingStudentProgress.review_flag = name;
                                      } else {
                                        const newStudentProgress = {
                                          recitationstep_id: itemstep.id,
                                          save_flag: null,
                                          review_flag: name,
                                        };
                                        studentProgress.push(
                                          newStudentProgress,
                                        );
                                      }
                                      responseData = studentProgress;
                                      user.studentProgress = studentProgress;
                                    }
                                    return user;
                                  });
                                return halaka;
                              });
                              doc.data = data;
                              db.put(doc);
                              return responseData;
                            })
                            .then(response => {
                              self.setState({
                                studentProgress: response,
                              });
                            });
                          //  }, 50);
                        }}>
                        {[
                          '0',
                          '1',
                          '2',
                          '3',
                          '4',
                          '5',
                          '6',
                          '7',
                          '8',
                          '9',
                          '10',
                          '11',
                          '12',
                          '13',
                          '14',
                          '15',
                          '16',
                          '17',
                          '18',
                          '19',
                          '20',
                        ].map(step => (
                          <Picker.Item label={step + ''} value={step} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                );
              })}
          </View>
        </View>
      </ImageBackground>
    );
  }
}
export default RevisionScreen;
