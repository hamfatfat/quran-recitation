import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  FlatList,
  ImageBackground,
  ScrollView,
} from 'react-native';
import PouchDB from 'pouchdb';
import Icon from 'react-native-vector-icons/FontAwesome';
PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default);
class StudentScreen extends React.Component {
  static navigationOptions = {
    title: 'الطلاب',
  };

  constructor(props) {
    super(props);
    this.state = {data: []};
    this.renderGroupMembers = this.renderGroupMembers.bind(this);
  }
  componentDidMount() {
    const self = this;
    const db = new PouchDB('recitation_db', {adapter: 'asyncstorage'});
    db.get('team').then(doc => {
      let data = doc.data;

      const groupData = data
        .filter(x => x.archive === false)
        .map(item => {
          return {
            id: item.datta_id,
            image: 'https://lorempixel.com/100/100/nature/1/',
            name: item.title,
            countMembers: item.user !== undefined ? item.user.length : 0,
            members:
              item.user !== undefined
                ? item.user.map(u => ({
                    userId: u.data_id,
                    halakId: item.data_id,
                    itemId: item.stepId,
                    halakaId: item.data_id,
                    studentName: u.studentName,
                  }))
                : [],
          };
        });
      self.setState({
        data: groupData,
      });
    });
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      const self = this;
      const dbb = new PouchDB('recitation_db', {adapter: 'asyncstorage'});
      dbb.get('team').then(function(doc) {
        let data = doc.data;

        const groupData = data
          .filter(x => x.archive === false)
          .map(item => {
            return {
              id: item.datta_id,
              image: 'https://lorempixel.com/100/100/nature/1/',
              name: item.title,
              countMembers: item.user !== undefined ? item.user.length : 0,
              members:
                item.user !== undefined
                  ? item.user.map(u => ({
                      userId: u.data_id,
                      halakId: item.data_id,
                      itemId: item.stepId,
                      halakaId: item.data_id,
                      studentName: u.studentName,
                    }))
                  : [],
            };
          });
        self.setState({
          data: groupData,
        });
      });
    });
  }
  componentDidUpdate() {
    const self = this;
    const db = new PouchDB('recitation_db', {adapter: 'asyncstorage'});
    db.get('team').then(doc => {
      let data = doc.data;

      const groupData = data
        .filter(x => x.archive === false)
        .map(item => {
          return {
            id: item.datta_id,
            image: 'https://lorempixel.com/100/100/nature/1/',
            name: item.title,
            countMembers: item.user !== undefined ? item.user.length : 0,
            members:
              item.user !== undefined
                ? item.user.map(u => ({
                    userId: u.data_id,
                    halakId: item.data_id,
                    itemId: item.stepId,
                    halakaId: item.data_id,
                    studentName: u.studentName,
                  }))
                : [],
          };
        });
      self.setState({
        data: groupData,
      });
    });
  }
  renderGroupMembers = group => {
    if (group.members) {
      return (
        <View style={styles.groupMembersContent}>
          {group.members.map((prop, key) => {
            return (
              <TouchableHighlight
                style={{
                  height: 35,
                  width: '40%',
                  //backgroundColor: '#5a6639',
                  color: 'white',
                  borderRadius: 15,
                  paddingLeft: 5,
                  margin: 10,
                }}
                onPress={() => {
                  this.props.navigation.navigate('Revision', {
                    itemId: prop.itemId,
                    halakaId: prop.halakaId,
                    userId: prop.userId,
                    studentName: prop.studentName,
                  });
                }}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text
                    key={key}
                    style={styles.memberImage}
                    // source={{uri: prop}}
                  >
                    {prop.studentName}
                  </Text>
                  <Icon name="user" size={25} color="white" />
                </View>
              </TouchableHighlight>
            );
          })}
        </View>
      );
    }
    return null;
  };

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
                  fontSize: 40,
                  height: 120,
                  width: '50%',
                  paddingRight: '10%',
                  fontFamily: 'Amiri-Regular',
                }}>
                الطلاب
              </Text>
            </ImageBackground>
          </View>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <FlatList
              style={styles.root}
              data={this.state.data}
              extraData={this.state}
              ItemSeparatorComponent={() => {
                return <View style={styles.separator} />;
              }}
              keyExtractor={item => {
                return item.id;
              }}
              renderItem={item => {
                const Group = item.item;
                let mainContentStyle;
                if (Group.attachment) {
                  mainContentStyle = styles.mainContent;
                }
                return (
                  <View style={styles.container}>
                    <View style={styles.content}>
                      <View style={mainContentStyle}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            padding: 10,
                            backgroundColor: '#000000',
                            opacity: 0.7,
                            borderTopRightRadius: 25,
                            borderTopLeftRadius: 25,
                            marginRight: 10,
                            marginLeft: 10,
                          }}>
                          <Image
                            source={require('../images/team.png')}
                            style={styles.avatar}
                          />
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'column',
                              marginLeft: 10,
                            }}>
                            <View style={styles.text}>
                              <Text style={styles.groupName}>{Group.name}</Text>
                            </View>
                            <Text style={styles.countMembers}>
                              {`عدد الطلاب ${Group.countMembers}`}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {this.renderGroupMembers(Group)}
                    </View>
                  </View>
                );
              }}
            />
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    //backgroundColor: '#FFFFFF',
  },
  container: {
    marginBottom: 10,
    flexDirection: 'row',
    //borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 25,
  },
  text: {
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  content: {
    flex: 1,
    //   marginLeft: 16,
    marginRight: 0,
  },
  mainContent: {
    //marginRight: 20,
  },
  memberImage: {
    height: 30,
    width: 100,
    marginRight: 4,
    borderRadius: 10,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: 'white',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    // backgroundColor: '#CCCCCC',
  },
  countMembers: {
    color: '#FFFFFF',
  },
  timeAgo: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  groupName: {
    fontSize: 23,
    color: '#FFFFFF',
  },
  groupMembersContent: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    opacity: 0.8,
    backgroundColor: '#525e31',
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    marginRight: 10,
    marginLeft: 10,

    // marginTop: 10,
  },
});

export default StudentScreen;
