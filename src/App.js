import React, { Component } from "react";
import get from "lodash/get";
import uniqBy from "lodash/uniqBy";
import { IDX } from "./constant";
import api from "./request";

class App extends Component {
  state = {
    main_balance: null,
    bonus: null,
    loading: false
  };

  requestSession = () => {
    this.setState({
      loading: true
    });
    return api()
      .post("/", { idx: IDX })
      .then(response => {
        const session_id = get(response, "data.session");
        this.requestBalance(session_id);
        this.requestBonus(session_id);
      });
  };

  requestBalance = sessionId => {
    return api()
      .post("/get_detail", { id: sessionId })
      .then(response => {
        this.setState({
          main_balance: response.data,
          loading: false
        });
      });
  };

  requestBonus = () => {
    return api()
      .post("/get_bonus", { idx: IDX })
      .then(response => {
        this.setState({
          bonus: response.data,
          loading: false
        });
      });
  };

  componentDidMount() {
    this.requestSession();
  }

  render() {
    const { main_balance, bonus, loading } = this.state;
    const detail_paket = uniqBy(get(main_balance, "detail_paket"), "benAmount");
    const benefit = uniqBy(get(main_balance, "benefit"), "benAmount");
    const bonus_package = get(bonus, "paket_bonus");
    if (loading) {
      return (
        <div className="smartpret-container">
          Loading My Smartfren Balance...
        </div>
      );
    }
    return (
      <div className="smartpret-container">
        {detail_paket &&
          detail_paket.map((item, index) => {
            return <MainItem item={item} key={index} />;
          })}
        {benefit &&
          benefit.map((item, index) => {
            return <MainItem item={item} key={index} />;
          })}
        {bonus_package &&
          bonus_package.map((item, index) => {
            return <BonusItem item={item} key={index} />;
          })}
      </div>
    );
  }
}

const MainItem = ({ item }) => {
  if (item.benAmount !== 0) {
    return (
      <span>
        {item.benName} : {item.benAmount.toLocaleString()} {item.desc}
      </span>
    );
  }
  return null;
};

const BonusItem = ({ item }) => {
  if (item.bonusBalance !== 0) {
    return (
      <span>
        {item.bonusName} : {item.bonusBalance.toLocaleString()} {item.bonusDesc}
      </span>
    );
  }
  return null;
};

export default App;
