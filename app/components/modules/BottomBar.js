import React from "react";
import { BottomNavigation } from "react-native-paper";

import colors from "../../config/colors";
import PlayerLogin from "../../view/PlayerStats/PlayerLogin";
import Menu from "../../view/Menu/Menu";
import Events from '../../view/EventsPage/Events'
  import { useDispatch} from "react-redux";
import {
  moreInfoEventClosed,
  moreInfoCarouselClosed,
} from "../../store/reducers/uiReducerNoPersist";

const StatsRoute = () => <PlayerLogin />;

const MenuRoute = () => <Menu />;

const EventRoute = () => <Events/>;

const BottomBar = () => {
  const dispatch = useDispatch();


  const handleReturn = () => {
  
      dispatch(moreInfoCarouselClosed());
      dispatch(moreInfoEventClosed());
    
  };
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "Events",
      title: "Events",
      icon: "trophy-outline",
      color: colors.background2,
    },
    {
      key: "myStats",
      title: "My Stats",
      icon: "graph-outline",
      color: colors.background,
    },
    {
      key: "Menu",
      title: "Menu",
      icon: "menu",
      color: colors.background3,
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    Events: EventRoute,
    myStats: StatsRoute,
    Menu: MenuRoute,
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
