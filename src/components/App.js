import React, { Component } from 'react';
import Achievements from './Achievements/Achievements';
import ClickBoard from './ClickBoard/ClickBoard';
import Header from './Header/Header';
import Shop from './Shop/Shop';
import Footer from './Footer/Footer';
import {NotificationTop, NotificationLeft} from './Notification/Notification';

import _SETTINGS from '../constants/settings';
import { 
  buyItem,
  calculatePerSecond,
  getAchievementBonus,
  levelCalculation, 
  chanceCalculation, 
  achievementsChecker,
  loadSettings,
  saveSettings
} from './libs';

class App extends Component {
  constructor() {
    super();

    const loadedSettings = loadSettings(_SETTINGS);
    this.state = {
      ...loadedSettings,
      metris_per_second_value: calculatePerSecond(
        loadedSettings.items,
        loadedSettings.achievements.length
      ),
      achievements_window_open: false
    };
    this.start = 0;
    this.lastClick = 0;
    this.clicks = 0;
  }

  gold_time = () => {
    
    const base_per_second = this.state.metris_per_second_value;
    clearInterval(this.metris_per_second_timer);
    this.setState({ 
      metris_per_second_value: base_per_second + this.state.metris_gold_time_value,
      metris_gold_time_active: true,
      notification_left_show: true,
      notification_left_text: '超级时间！'
    });

    let timeleft = this.state.metris_gold_time_duration * 10;

    this.metris_gold_time_timer = setInterval(() => {
      this.metrisClick(this.state.metris_gold_time_value / 10, false);
      timeleft--;

      if(timeleft <= 0){
        clearInterval(this.metris_gold_time_timer);
        this.metris_per_second_timer = setInterval(this.metrisPerSecondClick, 100);
        const basePerSecond =
          this.state.metris_per_second_value - this.state.metris_gold_time_value;

        this.setState({ 
          metris_per_second_value: basePerSecond,
          metris_gold_time_active: false,
          notification_left_show: false
        }, () => saveSettings(this.state));
      }
        
    }, 100)
  }

  //Component update state;
  metrisClick = (number = this.state.metris_click_value, player_click = true) => {
    let add_value = number;
    let checkAdd = 0;
    let goldClickUnlocked = false;
    let goldTimeUnlocked = false;
    let nextClickFrequency = this.state.metris_player_click_frequency;

    if (player_click) {
      if (!this.start ||
        (this.state.metris_player_click_frequency < 4 &&
          (this.lastClick - this.start) / 1000 >= 5)) {
        this.start = this.lastClick = new Date();
        this.clicks = 0;
      }

      if (this.clicks >= 6) {
        ++this.clicks;
        nextClickFrequency = this.clicks / (new Date() - this.start) * 1000;
        this.lastClick = new Date();
      } else {
        ++this.clicks;
      }

      if (chanceCalculation(this.state.metris_gold_click_chance)) {
        add_value = this.state.metris_gold_click_value;
        goldClickUnlocked = true;
      }

      if (chanceCalculation(this.state.metris_gold_time_chance) &&
          !this.state.metris_gold_time_active) {
        goldTimeUnlocked = true;
      }

      checkAdd = 1;
    }

    const previousAchievementCount = this.state.achievements.length;

    this.setState(prevState => {
      const nextAmount = prevState.metris_amount + add_value;
      const nextClickCounter = prevState.metris_player_click_counter + checkAdd;
      const nextGoldClickCounter = prevState.metris_gold_click_counter +
        (goldClickUnlocked ? 1 : 0);
      const nextGoldTimeCounter = prevState.metris_gold_time_counter +
        (goldTimeUnlocked ? 1 : 0);

      const achievementValues = {
        ...prevState,
        metris_amount: nextAmount,
        metris_player_click_counter: nextClickCounter,
        metris_player_click_frequency: player_click
          ? nextClickFrequency
          : prevState.metris_player_click_frequency,
        metris_gold_click_counter: nextGoldClickCounter,
        metris_gold_time_counter: nextGoldTimeCounter
      };

      const newAchievements = achievementsChecker(prevState.achievements)
        .filter((achievement) => achievementValues[achievement.type] >= achievement.value)
        .map((achievement) => ({ name: achievement.name }));

      const nextAchievements = newAchievements.length > 0
        ? [...prevState.achievements, ...newAchievements]
        : prevState.achievements;
      const nextPerSecond = newAchievements.length > 0
        ? calculatePerSecond(prevState.items, nextAchievements.length) +
          (prevState.metris_gold_time_active ? prevState.metris_gold_time_value : 0)
        : prevState.metris_per_second_value;

      return {
        metris_amount: nextAmount,
        metris_player_click_counter: nextClickCounter,
        metris_player_click_frequency: achievementValues.metris_player_click_frequency,
        metris_gold_click_counter: nextGoldClickCounter,
        metris_gold_time_counter: nextGoldTimeCounter,
        player_level: Math.max(
          prevState.player_level,
          levelCalculation(nextAmount)
        ),
        achievements: nextAchievements,
        metris_per_second_value: nextPerSecond,
        notification_left_show: goldClickUnlocked || prevState.metris_gold_time_active,
        notification_left_text: goldClickUnlocked
          ? '金手指！'
          : prevState.metris_gold_time_active ? '超级时间！' : ''
      };
    }, () => {
      if (goldClickUnlocked) {
        setTimeout(() => {
          this.setState({
            notification_left_show: false,
            notification_left_text: ''
          });
        }, 2000);
      }

      const hasNewAchievement =
        this.state.achievements.length > previousAchievementCount;

      if (hasNewAchievement) {
        this.setState({
          notification_top_show: true,
          notification_top_text: '获得新成就!'
        });

        setTimeout(() => {
          this.setState({
            notification_top_show: false,
            notification_top_text: ''
          });
        }, 3000);
      }

      saveSettings(this.state);

      if (goldTimeUnlocked) {
        this.gold_time();
      }
    });

    return {
      gained: add_value,
      goldClick: goldClickUnlocked,
      goldTime: goldTimeUnlocked
    };
  };

  metrisPerSecondClick = () => {
    if(this.state.items.length > 0){
      this.metrisClick(this.state.metris_per_second_value / 10, false)
    }
  }

  metrisBuyItem = (item, price, products) => {
    if (this.state.metris_amount < price) return;

    const changeState = buyItem(
      item,
      price,
      this.state.items,
      this.state.achievements.length
    )

    this.setState(prevState => ({ 
      items: changeState.item,
      metris_amount: prevState.metris_amount - changeState.price,
      metris_per_second_value: prevState.metris_gold_time_active
        ? changeState.per_sec_multi + this.state.metris_gold_time_value
        : changeState.per_sec_multi,
      items_buy_counter: prevState.items_buy_counter + 1,
      stick_buy_counter: prevState.stick_buy_counter + (item === '槌子' ? 1 : 0),
      monk_buy_counter: prevState.monk_buy_counter + (item === '信徒' ? 1 : 0),
      book_buy_counter: prevState.book_buy_counter + (item === '金刚经' ? 1 : 0),
      temple_buy_counter: prevState.temple_buy_counter + (item === '寺庙' ? 1 : 0),
      jesus_buy_counter: prevState.jesus_buy_counter + (item === '基督' ? 1 : 0),
      jew_buy_counter: prevState.jew_buy_counter + (item === '犹太' ? 1 : 0),
      islam_buy_counter: prevState.islam_buy_counter + (item === '清真' ? 1 : 0),
      pasta_buy_counter: prevState.pasta_buy_counter + (item === '飞天意面神教' ? 1 : 0),
      atom_buy_counter: prevState.atom_buy_counter + (item === '原子加速器' ? 1 : 0),

      products: products
    }), () => {
      saveSettings(this.state);
    });
  }

  openAchievements = () => {
    this.setState({ achievements_window_open: true });
  };

  closeAchievements = () => {
    this.setState({ achievements_window_open: false });
  };

  resetGame = () => {
    clearInterval(this.metris_per_second_timer);
    localStorage.removeItem('metrisClicker');
    window.location.reload();
  }

  //Component Lifecycle
  componentDidMount() {
    this.metris_per_second_timer = setInterval(this.metrisPerSecondClick, 100);
    this.setState({
      notification_top_show: false,
      notification_left_show: false,
      notification_top_text: '',
      notification_left_text: ''
    })
  }

  componentWillUnmount() {
    clearInterval(this.metris_per_second_timer);
    clearInterval(this.metris_gold_time_timer);
  }

  render() {

    const {
      metris_amount, 
      player_name, 
      items, 
      products,
      metris_per_second_value, 
      achievements,
      notification_top_text,
      notification_top_show,
      notification_left_text,
      notification_left_show
    } = this.state;

    document.title = `${parseInt(metris_amount, 10).toLocaleString()} 功德 | 功德点击器`;

    return (
      <div className="container">

        <NotificationTop 
          notification_text={notification_top_text} 
          notification_show={notification_top_show}
        />

        <NotificationLeft 
          notification_text={notification_left_text} 
          notification_show={notification_left_show}
        />

        <Header 
          player_name = {player_name}
          metris_amount = {metris_amount}
          metris_per_second_value = {metris_per_second_value}
        />

        <Shop
          metris_amount={metris_amount}
          items={items}
          onClick={this.metrisBuyItem}
          products={products}
          achievementMultiplier={
            1 + getAchievementBonus(this.state.achievements.length)
          }
        />

        <ClickBoard
          onClick={this.metrisClick}
          stickCount={
            (items.find(item => item.name === '槌子') || { count: 0 }).count
          }
        />
        
        <Achievements
          achievements={achievements}
          productionBonus={getAchievementBonus(achievements.length)}
          show={this.state.achievements_window_open}
          onOpen={this.openAchievements}
          onClose={this.closeAchievements}
        />

        <Footer onClick={this.resetGame}/>
      </div>
    );
  }
}

export default App;
