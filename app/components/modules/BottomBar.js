import React, { useState } from "react";
import { BottomNavigation, Text } from "react-native-paper";
import { AdMobBanner } from "expo-ads-admob";
import colors from "../../config/colors";
import PlayerStats from "../../view/PlayerStats/PlayerStats";
import BrawlerBot from "../../view/BrawlerBot";
import Events from "../../view/EventsPage/Events";
import LoadingPage from "../../view/LoadingPage";
import { useDispatch, useSelector } from "react-redux";
import {
  moreInfoEventClosed,
  moreInfoCarouselClosed,
} from "../../store/reducers/uiReducerNoPersist";

const StatsRoute = () => <PlayerStats />;

const BotRoute = () => <BrawlerBot />;

const EventRoute = () => <LoadingPage />;

const BottomBar = () => {
  const dispatch = useDispatch();


  const handleReturn = () => {
  
      dispatch(moreInfoCarouselClosed());
      dispatch(moreInfoEventClosed());
    
  };
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "myStats",
      title: "My Stats",
      icon: "graph-outline",
      color: "#0a122a",
    },
    {
      key: "Events",
      title: "Events",
      icon: "trophy-outline",
      color: "#1C3273",
    },
    {
      key: "Bot",
      title: "Brawler Bot",
      icon: "database-search",
      color: "#1C3273",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    myStats: StatsRoute,
    Events: EventRoute,
    Bot: BotRoute,
  });

  return (
    <>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={handleReturn()}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={true}
        barStyle={{ backgroundColor: colors.background }}
      />
    </>
  );
};

export default BottomBar;
