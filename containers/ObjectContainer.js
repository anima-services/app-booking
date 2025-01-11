import React, {
  useEffect,
  useState
} from "react";
import {
  View
} from 'react-native';

import {
  Styles
} from '../utils/styles';

import Menu from '../components/Menu';
import Table from '../components/Table';
import UsersTable from '../components/UsersTable';
import BackButton from "../components/BackButton";

import {
  useSelector
} from 'react-redux';

export default function ObjectContainer(props) {
  const data = useSelector((state) => state.appData.data);

  const [busy,
    setBusy] = useState(false);

  const [scroll,
    setScroll] = useState(true);
  const [userSelector,
    selectUsers] = useState( {
      open: false, singleSelection: false, users: []
    });
  const [selected,
    select] = useState([]);

  const [reservationSelected,
    selectReservation] = useState(undefined);
  const [selectedMenu,
    selectMenu] = useState(0);

  const [currentEvent,
    updateCurrentEvent] = useState();

  useEffect(() => {
    select([]);
  }, [userSelector]);

  useEffect(() => {
    setBusy(data[`space_${props.objectId}`] && data[`space_${props.objectId}`].is_reserved_now);
  }, [data[`space_${props.objectId}`]]);

  return (
    <View style={[Styles.main, busy ? Styles.main.busy: Styles.main.free]}>
      <Menu
        date={props.date}
        objectData={data[`space_${props.objectId}`]}
        reservationsData={data[`reservations_${props.objectId}`]}
        reservationSelected={reservationSelected}
        selectReservation={selectReservation}
        usersData={data.usersData}
        objectId={props.objectId}
        setUpdate={props.setUpdate}

        currentEvent={currentEvent}

        selectedMenu={selectedMenu} selectMenu={selectMenu}
        userSelector={userSelector} selected={selected} selectUsers={selectUsers}
        setScroll={setScroll}
        >
        {props.showBack ? <BackButton selectMenu={props.goToMain} title="На главную" />: <></>}
      </Menu>
      <View style={userSelector.open ? Styles.table: { display: 'none' }}>
        <UsersTable
          users={userSelector.users}
          selected={selected}
          select={select} userSelector={userSelector}
          />
      </View>
      <View style={userSelector.open ? { display: 'none' }: Styles.table}>
        <Table
          date={props.date}
          objectData={data[`space_${props.objectId}`]}
          reservationsData={data[`reservations_${props.objectId}`]}
          selectReservation={selectReservation}

          updateCurrentEvent={updateCurrentEvent}

          selectedMenu={selectedMenu} selectMenu={selectMenu}
          scroll={scroll} setScroll={setScroll}
          />
      </View>
    </View>
  );
}