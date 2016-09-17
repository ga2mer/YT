import React, {Component} from 'react';
import appState from './stores/AppState';
import UserStore from './stores/UserStore';
import videoStore from './stores/VideoStore';
import {
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Navigator,
    StatusBar,
    Modal,
    ViewPagerAndroid,
    ActivityIndicator
} from 'react-native';
import Main from './components/Main/Main';
import Auth from './components/Main/Auth';
import Search from './components/Search/Search';
import SearchInput from './components/Search/SearchInput';
import Channel from './components/Channel/Channel';
import {observer, Provider} from 'mobx-react/native';
import Video from './components/Video/Video';
import {ToolbarAndroid} from 'react-native-vector-icons/MaterialIcons';
import SearchStore from './stores/SearchStore';
import ToolbarTitle from './components/ToolbarTitle';
@observer
export default class App extends Component {
    /*state = {
        value: 1
    }
    componentDidMount() {
        setInterval(() => {
            this.setState({value: Math.random()});
            console.log('changed');
        }, 10000);
    }*/
    render() {
        if (!appState.init) {
            return <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}><ActivityIndicator animating size="large"/></View>;
        }
        return (
            <View style={{
                flex: 1
            }}>
                <StatusBarComponent/>
                <Navigator initialRoute={{
                    name: 'main'
                }} renderScene={(route, navigator) => {
                    var component = null;
                    var toolbarProps = {
                        backgroundColor: '#e62117'
                    };
                    switch (route.name) {
                        case 'main':
                            component = <Main/>;
                            break;
                        case 'auth':
                            component = <Auth/>;
                            break;
                        case 'search':
                            toolbarProps.navIconName = 'arrow-back';
                            toolbarProps.onIconClicked = navigator.pop;
                            toolbarProps.children = React.createElement(SearchInput, {store: route.passProps.store});
                            component = <Search searchStore={route.passProps.store}/>;
                            break;
                        case 'channel':
                            toolbarProps.navIconName = 'arrow-back';
                            toolbarProps.onIconClicked = navigator.pop;
                            toolbarProps.children = React.createElement(ToolbarTitle, {store: route.passProps.store});
                            component = <Channel channelStore={route.passProps.store}/>;
                            break;
                    }
                    if (['main', 'channel'].includes(route.name)) {
                        toolbarProps.actions = [
                            {
                                title: 'Search',
                                iconName: 'search',
                                iconSize: 26,
                                show: 'always'
                            }, {
                                title: 'Menu',
                                iconName: 'more-vert',
                                iconSize: 26,
                                show: 'always'
                            }
                        ];
                        toolbarProps.onActionSelected = () => {
                            navigator.push({
                                name: 'search',
                                passProps: {
                                    store: new SearchStore()
                                }
                            });
                        }
                    }
                    return (
                        <Provider navigator={navigator}>
                            <View style={{
                                flex: 1
                            }}>
                                <ToolbarAndroid title={appState.title} {...toolbarProps} titleColor={'white'} height={56}/>{component}
                            </View>
                        </Provider>
                    )
                }}></Navigator>
                <VideoComponent/>
            </View>
        );
    }
}
@observer
class StatusBarComponent extends Component {
    render() {
        return (<StatusBar hidden={videoStore.full} backgroundColor={videoStore.enable && 'black' || "rgb(200, 33, 23)"} barStyle="light-content"/>);
    }
}
@observer
class VideoComponent extends Component {
    render() {
        if (!videoStore.enable) {
            return false;
        }
        return (
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}>
                <Video/>
            </View>
        );
    }
}
