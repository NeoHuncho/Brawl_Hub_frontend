import React, { useState} from "react";
import { BottomNavigation, Text } from 'react-native-paper';
import colors from "../../config/colors";
import PlayerLogin from '../../view/PlayerStats/PlayerLogin'
import BrawlerBot from '../../view/BrawlerBot'
import Events from '../../view/Events'

const StatsRoute = () => <PlayerLogin/>;

const BotRoute = () => <BrawlerBot/>;

const EventRoute = () => <Events/>;

const BottomBar= () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'myStats', title: 'My Stats', icon: 'queue-music',color:'#0C1531' },
    { key: 'Bot', title: 'Brawler Bot', icon: 'album',color:'#142352' },
    { key: 'Events', title: 'Events', icon: 'history',color:'#1C3273' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    myStats: StatsRoute,
    Bot: BotRoute,
    Events: EventRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={true}
      barStyle={{ backgroundColor:colors.background }}
 
    />
  );
};
export default BottomBar;