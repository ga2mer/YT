import React, {Component} from 'react';
import {View, StyleSheet, ViewPagerAndroid, Text} from 'react-native';
import {observer, Provider} from 'mobx-react/native';
import {Tab, TabLayout} from 'react-native-android-tablayout';
import EmptyTab from '../empty.js';
import AboutTab from './AboutTab';
import VideosTab from './VideosTab';
@observer
export default class Channel extends Component {
    state = {
        pagePosition: 0
    };
    _setPagePosition = (e) => {
        const pagePosition = e.nativeEvent.position;
        this.setState({pagePosition});
        // too bad ViewPagerAndroid doesn't support prop updates,
        // work around by forwarding changes using exposed API
        this.viewPager.setPage(pagePosition);
        if (e._targetInst._currentElement.type.displayName == 'TabLayout') {
            this.props.channelStore.handleSetPage(pagePosition);
        }
    }
    render() {
        return (
            <Provider channelStore={this.props.channelStore}>
                <View style={styles.flexOne}>
                    <TabLayout selectedTabIndicatorColor={'white'} tabGravity={'center'} style={styles.tabLayout} selectedTab={this.state.pagePosition} onTabSelected={this._setPagePosition}>
                        <Tab name={'Главная'}/>
                        <Tab name={'Видео'}/>
                        <Tab name={'О канале'}/>
                    </TabLayout>
                    <View style={styles.flexOne}>
                        <ViewPagerAndroid initialPage={0} style={styles.viewPager} ref={(c) => {
                            this.viewPager = c
                        }} onPageSelected={this._setPagePosition}>
                            <View><EmptyTab/></View>
                            <View><VideosTab/></View>
                            <View><AboutTab/></View>
                        </ViewPagerAndroid>
                    </View>
                </View>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    flexOne: {
        flex: 1
    },
    tabLayout: {
        backgroundColor: '#e62117',
        height: 50
    },
    icon: {
        paddingTop: 5,
        paddingLeft: 15
    },
    viewPager: {
        flex: 1
    },
    content: {
        padding: 10
    }
});
