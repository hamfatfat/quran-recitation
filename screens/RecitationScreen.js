/* eslint-disable react-native/no-inline-styles */
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

import Icon from 'react-native-vector-icons/FontAwesome';
import * as quran from '../data/quran.json';
import {Button} from 'react-native-elements';
import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default);
class RecitationScreen extends React.Component {
  static navigationOptions = {
    title: 'المصحف الشريف',
  };

  constructor(props) {
    super(props);
    this.state = {ayats: [], page: 1};
    // this.renderGroupMembers = this.renderGroupMembers.bind(this);
  }
  componentDidMount() {
    const self = this;
    const toAya = self.props.route.params.toAya;
    const souraID = self.props.route.params.souraID;
    const soura = self.props.route.params.soura;
    let ayaPage = null;
    if (soura.indexOf('الحزب') > -1) {
      ayaPage = quran.data.find(
        x => x.QuardJuzaaText + '' === soura + '' && x.startQuardJuzaa === 1,
      );
    } else
      ayaPage = quran.data.find(
        x => x.VerseID + '' === toAya + '' && x.SuraID === souraID,
      );
    const quranPage = quran.data.filter(x => x.page === ayaPage.page);
    self.setState({ayats: quranPage, page: ayaPage.page});
  }
  componentDidUpdate() {
    /*const self = this;
    const toAya = self.props.route.params[toAya', 'NO-ID');
    const souraID = self.props.route.params[souraID', 'NO-ID');
    const soura = self.props.route.params[soura', 'NO-ID');
    setTimeout(() => {
      const ayaPage = quran.data.find(
        x => x.VerseID + '' === toAya && x.SuraID === souraID,
      );
      const quranPage = quran.data.filter(x => x.page === ayaPage.page);
      self.setState({ayats: quranPage, page: ayaPage.page});
    }, 50);*/
  }
  move = delta => {
    const page = this.state.page + delta;
    if (page >= 0 && page <= 604) {
      const self = this;

      const quranPage = quran.data.filter(x => x.page === page);
      self.setState({ayats: quranPage, page: page});
    }
  };
  render() {
    const page = [];
    let ayaText = '';
    this.state.ayats.forEach((x, index) => {
      //ayaText = x.AyahText;

      if (x.VerseID === 1) {
        if (ayaText.length > 0) {
          page.push(
            <Text
              style={{
                fontFamily: 'Amiri-Regular',
                color: 'white',
                fontSize: 25,
                textAlign: 'justify',
              }}>
              {ayaText}
            </Text>,
          );
        }
        page.push(
          <ImageBackground
            source={require('../images/soura.png')}
            style={{width: '100%', height: 120}}>
            <Text
              style={{
                fontFamily: 'Amiri-Bold',
                color: 'white',
                fontSize: 25,
                flex: 1,
                textAlign: 'center',
                paddingTop: 40,
                textAlignVertical: 'center',
                alignItems: 'center',
              }}>
              {x.suraName}
            </Text>
          </ImageBackground>,
        );
        if (
          x.AyahText.indexOf('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ') > -1 &&
          this.props.route.params['souraID'] !== 1
        ) {
          page.push(
            <Text
              style={{
                fontFamily: 'Amiri-Regular',
                color: 'white',
                fontSize: 25,
                textAlign: 'center',
              }}>
              {'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
            </Text>,
          );
        }
      }
      if (x.VerseID === 1) {
        ayaText = x.AyahText.replace(
          'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ',
          '',
        );
      }
      ayaText =
        (x.startQuardJuzaa === 1 ? `(${x.QuardJuzaaText})` : '') +
        ayaText +
        (x.VerseID !== 1 ? x.AyahText : '') +
        '(' +
        x.VerseID +
        ')';
    });
    if (ayaText.length > 0) {
      page.push(
        <Text
          style={{
            fontFamily: 'Amiri-Regular',
            color: 'white',
            fontSize: 25,
            textAlign: 'justify',
          }}>
          {ayaText}
        </Text>,
      );
    }
    const text = page.join(' ');
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
                  flexDirection: 'row',
                  paddingTop: 10,
                  width: '50%',
                  height: 160,
                }}>
                <Button
                  containerStyle={{
                    width: '25%',
                    marginTop: 30,
                    textAlignVertical: 'center',
                    alignItems: 'center',
                  }}
                  type="clear"
                  icon={<Icon name="angle-right" size={25} color="white" />}
                  enabled={this.state.page > 0}
                  onPress={() => this.move(-1)}
                />
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    height: 120,
                    textAlignVertical: 'center',
                    alignItems: 'center',
                    fontFamily: 'Amiri-Regular',
                  }}>
                  {`المصحف \n الصفحة ${this.state.page}`}
                </Text>
                <Button
                  containerStyle={{
                    width: '25%',
                    marginTop: 30,
                    textAlignVertical: 'center',
                    alignItems: 'center',
                  }}
                  type="clear"
                  icon={<Icon name="angle-left" size={25} color="white" />}
                  enabled={this.state.page < 604}
                  onPress={() => this.move(1)}
                />
              </View>
            </ImageBackground>
          </View>
          <ScrollView
            contentContainerStyle={{
              justifyContent: 'center',
              backgroundColor: '#000000',
              opacity: 0.7,
              borderRadius: 15,
              width: '100%',
              padding: 10,
            }}>
            {page.map(x => x)}
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

export default RecitationScreen;
