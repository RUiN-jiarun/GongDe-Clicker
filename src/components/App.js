import React, { Component } from 'react';
import Achievements from './Achievements/Achievements';
import ClickBoard from './ClickBoard/ClickBoard';
import Header from './Header/Header';
import Shop from './Shop/Shop';
import Footer from './Footer/Footer';
import {NotificationTop, NotificationLeft} from './Notification/Notification';

import _SETTINGS from '../constants/settings';
import { 
  checkSettingsImport, 
  buyItem, 
  levelCalculation, 
  chanceCalculation, 
  achievementsChecker, 
  encode, 
  decode 
} from './libs';

class App extends Component {
  constructor(){
    super();

    // if(localStorage.getItem('metrisClicker'))
    //   if(checkSettingsImport(_SETTINGS, JSON.parse(decode(localStorage.getItem('metrisClicker')))))
    //     this.state = JSON.parse(decode(localStorage.getItem('metrisClicker')));
    //   else
    //     this.state = _SETTINGS
    // else
    //   this.state = _SETTINGS
    this.state = _SETTINGS
    this.notification_top_show = false;
    this.start = 0
    this.clicks = 0
  }

  gold_time = () => {
    
    let temp_per_sec_click = this.state.metris_per_second_value;
    clearInterval(this.metris_per_second_timer);
    this.setState({ 
      metris_per_second_value: temp_per_sec_click + this.state.metris_gold_time_value,
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
        this.setState({ 
          metris_per_second_value: temp_per_sec_click,
          metris_gold_time_active: false,
          notification_left_show: false
        });
      }
        
    }, 100)
  }

  //Component update state;
  metrisClick = (number = this.state.metris_click_value, player_click = true) => {

    let add_value = number;
    let checkAdd = 0;

    if(player_click){
      
      if (!this.start || 
        (this.state.metris_player_click_frequency < 4 && (this.lastClick - this.start) / 1000 >= 5)){
          this.start = this.lastClick = new Date();
          this.clicks = 0
        }
      
      if(this.clicks >= 6){
        this.setState({
          metris_player_click_frequency: ++this.clicks / (new Date() - this.start) * 1000
        });
  
        this.lastClick = new Date()
      }else{
        ++this.clicks
      }

      if(chanceCalculation(this.state.metris_gold_click_chance)){
        add_value = this.state.metris_gold_click_value;

        this.setState(prevState => ({
          metris_gold_click_counter: prevState.metris_gold_click_counter + 1,
          notification_left_show: true,
          notification_left_text: '金手指！'
        }))

        setTimeout(() => {
          this.setState({
            notification_left_show: false,
            notification_left_text: ''
          }
        )}, 2000);
      }

      if(chanceCalculation(this.state.metris_gold_time_chance)){
        if(!this.state.metris_gold_time_active){
          this.setState(prevState => ({
            metris_gold_time_counter: prevState.metris_gold_time_counter + 1
          }))

          this.gold_time();
        }

      }

      checkAdd = 1;
    }

    this.setState(prevState => ({ 
      metris_amount: prevState.metris_amount + add_value,
      metris_player_click_counter: prevState.metris_player_click_counter + checkAdd
    }), () => {

      let free_achievements = achievementsChecker(this.state.achievements);
      let toAdd = {}
      for(let free of free_achievements){
        if(this.state[free.type] >= free.value)
          toAdd = {name: free.name}
      }

      if(toAdd.name){
        this.setState({
          notification_top_show: true,
          notification_top_text: '获得新成就!'
        })
        
        setTimeout(() => {
          this.setState({
            notification_top_show: false,
            notification_top_text: ''
          })
        }, 3000);
      }

      this.setState(prevState => ({
        player_level: levelCalculation(this.state.metris_amount) > prevState.player_level ? levelCalculation(this.state.metris_amount): prevState.player_level,
        achievements: [...prevState.achievements, toAdd]
      }), () => {
        localStorage.setItem('metrisClicker', encode(JSON.stringify(this.state)));
      })

    })
  };

  metrisPerSecondClick = () => {
    if(this.state.items.length > 0){
      this.metrisClick(this.state.metris_per_second_value / 10, false)
    }
  }

  metrisBuyItem = (item, price, products) => {
    const changeState = buyItem(item, price, this.state.items)

    this.setState(prevState => ({ 
      items: changeState.item,
      metris_amount: prevState.metris_amount - changeState.price,
      metris_per_second_value: changeState.per_sec_multi,
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

      // stick_buy_counter: items,
      // buddha_buy_counter: 0,
      // book_buy_counter: 0,
      // temple_buy_counter: 0,
      // jesus_buy_counter: 0,
      // jew_buy_counter: 0,
      // islam_buy_counter: 0,
      // pasta_buy_counter: 0,
      products: products
    }), () => {
      localStorage.setItem('metrisClicker', encode(JSON.stringify(this.state)))
    });
  }

  resetGame = () => {
    clearInterval(this.metris_per_second_timer);
    localStorage.clear();
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

    document.title = parseInt(metris_amount, 10).toLocaleString() + " metris | metris Clicker";

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
          metris_amount = {metris_amount}
          items = {items}
          onClick = {this.metrisBuyItem}
          products = {products}
        />

        <ClickBoard 
          onClick = {this.metrisClick}
        />
        
        <Achievements achievements = { achievements } />

        <Footer onClick={this.resetGame}/>
      </div>
    );
  }
}

export default App;
