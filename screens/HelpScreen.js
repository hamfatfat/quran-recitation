/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ImageBackground, Image, Text, ScrollView} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {cloneDeep} from 'lodash';
import ViewPager from '@react-native-community/viewpager';
const images = [
  {id: 0, props: {source: require('../documents/help/page0.jpg')}},
  {id: 1, props: {source: require('../documents/help/page1.jpg')}},
  {id: 2, props: {source: require('../documents/help/page2.jpg')}},
  {id: 3, props: {source: require('../documents/help/page3.jpg')}},
  {id: 4, props: {source: require('../documents/help/page4.jpg')}},
  {id: 5, props: {source: require('../documents/help/page5.jpg')}},
  {id: 6, props: {source: require('../documents/help/page6.jpg')}},
  {id: 7, props: {source: require('../documents/help/page7.jpg')}},
  {id: 8, props: {source: require('../documents/help/page8.jpg')}},
  {id: 9, props: {source: require('../documents/help/page9.jpg')}},
  {id: 10, props: {source: require('../documents/help/page10.jpg')}},
  {id: 11, props: {source: require('../documents/help/page11.jpg')}},
  {id: 12, props: {source: require('../documents/help/page12.jpg')}},
  {id: 13, props: {source: require('../documents/help/page13.jpg')}},
  {id: 14, props: {source: require('../documents/help/page14.jpg')}},
  {id: 15, props: {source: require('../documents/help/page15.jpg')}},
  {id: 16, props: {source: require('../documents/help/page16.jpg')}},
  {id: 17, props: {source: require('../documents/help/page17.jpg')}},
  {id: 18, props: {source: require('../documents/help/page18.jpg')}},
  {id: 19, props: {source: require('../documents/help/page19.jpg')}},
  {id: 20, props: {source: require('../documents/help/page20.jpg')}},
  {id: 21, props: {source: require('../documents/help/page21.jpg')}},
  {id: 22, props: {source: require('../documents/help/page22.jpg')}},
  {id: 23, props: {source: require('../documents/help/page23.jpg')}},
  {id: 24, props: {source: require('../documents/help/page24.jpg')}},
  {id: 25, props: {source: require('../documents/help/page25.jpg')}},
  {id: 26, props: {source: require('../documents/help/page26.jpg')}},
  {id: 27, props: {source: require('../documents/help/page27.jpg')}},
  {id: 28, props: {source: require('../documents/help/page28.jpg')}},
  {id: 29, props: {source: require('../documents/help/page29.jpg')}},
  {id: 30, props: {source: require('../documents/help/page30.jpg')}},
  {id: 31, props: {source: require('../documents/help/page31.jpg')}},
  {id: 32, props: {source: require('../documents/help/page32.jpg')}},
  {id: 33, props: {source: require('../documents/help/page33.jpg')}},
  {id: 34, props: {source: require('../documents/help/page34.jpg')}},
  {id: 35, props: {source: require('../documents/help/page35.jpg')}},
  {id: 36, props: {source: require('../documents/help/page36.jpg')}},
  {id: 37, props: {source: require('../documents/help/page37.jpg')}},
  {id: 38, props: {source: require('../documents/help/page38.jpg')}},
  {id: 39, props: {source: require('../documents/help/page39.jpg')}},
  {id: 40, props: {source: require('../documents/help/page40.jpg')}},
  {id: 41, props: {source: require('../documents/help/page41.jpg')}},
  {id: 42, props: {source: require('../documents/help/page42.jpg')}},
  {id: 43, props: {source: require('../documents/help/page43.jpg')}},
  {id: 44, props: {source: require('../documents/help/page44.jpg')}},
  {id: 45, props: {source: require('../documents/help/page45.jpg')}},
  {id: 46, props: {source: require('../documents/help/page46.jpg')}},
  {id: 47, props: {source: require('../documents/help/page47.jpg')}},
  {id: 48, props: {source: require('../documents/help/page48.jpg')}},
  {id: 49, props: {source: require('../documents/help/page49.jpg')}},
  {id: 50, props: {source: require('../documents/help/page50.jpg')}},
  {id: 51, props: {source: require('../documents/help/page51.jpg')}},
  {id: 52, props: {source: require('../documents/help/page52.jpg')}},
  {id: 53, props: {source: require('../documents/help/page53.jpg')}},
  {id: 54, props: {source: require('../documents/help/page54.jpg')}},
  {id: 55, props: {source: require('../documents/help/page55.jpg')}},
  {id: 56, props: {source: require('../documents/help/page56.jpg')}},
  {id: 57, props: {source: require('../documents/help/page57.jpg')}},
  {id: 58, props: {source: require('../documents/help/page58.jpg')}},
  {id: 59, props: {source: require('../documents/help/page59.jpg')}},
  {id: 60, props: {source: require('../documents/help/page60.jpg')}},
  {id: 61, props: {source: require('../documents/help/page61.jpg')}},
  {id: 62, props: {source: require('../documents/help/page62.jpg')}},
  {id: 63, props: {source: require('../documents/help/page63.jpg')}},
  {id: 64, props: {source: require('../documents/help/page64.jpg')}},
  {id: 65, props: {source: require('../documents/help/page65.jpg')}},
  {id: 66, props: {source: require('../documents/help/page66.jpg')}},
  {id: 67, props: {source: require('../documents/help/page67.jpg')}},
  {id: 68, props: {source: require('../documents/help/page68.jpg')}},
  {id: 69, props: {source: require('../documents/help/page69.jpg')}},
  {id: 70, props: {source: require('../documents/help/page70.jpg')}},
  {id: 71, props: {source: require('../documents/help/page71.jpg')}},
  {id: 72, props: {source: require('../documents/help/page72.jpg')}},
  {id: 73, props: {source: require('../documents/help/page73.jpg')}},
  {id: 74, props: {source: require('../documents/help/page74.jpg')}},
  {id: 75, props: {source: require('../documents/help/page75.jpg')}},
  {id: 76, props: {source: require('../documents/help/page76.jpg')}},
  {id: 78, props: {source: require('../documents/help/page77.jpg')}},
];
class HelpScreen extends React.Component {
  static navigationOptions = {
    title: 'دليل المستخدم',
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
                  fontSize: 31,
                  height: 120,
                  width: '50%',
                  paddingRight: '10%',
                  fontFamily: 'Amiri-Regular',
                }}>
                كتيب التعليمات
              </Text>
            </ImageBackground>
          </View>
          <ViewPager style={{flex: 1}} initialPage={77}>
            {images
              .sort((x, y) => x.id < y.id)
              .map((img, idx) => {
                return (
                  <View key={`${idx}`}>
                    <Image
                      style={{width: '100%', height: '100%', paddingTop: 20}}
                      source={img.props.source}
                    />
                  </View>
                );
              })}
          </ViewPager>
        </View>
      </ImageBackground>
    );
  }
}
export default HelpScreen;
