import React, {Component} from 'react';
import {View, StyleSheet, ViewPagerAndroid, Text} from 'react-native';
import {observer} from 'mobx-react/native';
import {Tab, TabLayout} from 'react-native-android-tablayout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MainTab from './MainTab';
import TopTab from './TopTab';
import SubsTab from './SubsTab';
import ProfileTab from './ProfileTab';
import EmptyTab from '../empty.js';
import mainStore from '../../stores/MainStore';
import userStore from '../../stores/UserStore';
@observer
export default class Main extends Component {
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
            mainStore.handleSetPage(pagePosition);
        }
    }
    render() {
        return (
            <View style={styles.flexOne}>
                <TabLayout selectedTabIndicatorColor={'white'} tabGravity={'center'} style={styles.tabLayout} selectedTab={this.state.pagePosition} onTabSelected={this._setPagePosition}>
                    <Tab>
                        <Icon style={styles.icon} name={'home'} size={30} color={this.state.pagePosition == 0
                            ? 'white'
                            : 'black'}/>
                    </Tab>
                    <Tab>
                        <Icon style={styles.icon} name={'whatshot'} size={30} color={this.state.pagePosition == 1
                            ? 'white'
                            : 'black'}/>
                    </Tab>
                    {userStore.isAuth && <Tab>
                        <Icon style={styles.icon} name={'subscriptions'} size={30} color={this.state.pagePosition == 2
                            ? 'white'
                            : 'black'}/>
                    </Tab>}
                    <Tab>
                        <Icon style={styles.icon} name={'person'} size={30} color={this.state.pagePosition == 3
                            ? 'white'
                            : 'black'}/>
                    </Tab>
                </TabLayout>
                <View style={styles.flexOne}>
                    <ViewPagerAndroid initialPage={0} style={styles.viewPager} ref={(c) => {
                        this.viewPager = c
                    }} onPageSelected={this._setPagePosition}>
                        <View><MainTab/></View>
                        <View><TopTab/></View>
                        {userStore.isAuth && <View><SubsTab/></View>}
                        <View><ProfileTab/></View>
                    </ViewPagerAndroid>
                </View>
            </View>
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
