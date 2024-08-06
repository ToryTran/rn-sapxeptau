import React, { useCallback, useEffect, useState,  type PropsWithChildren  } from 'react';
import { Alert, StyleSheet } from "react-native";
import { Button,TextInput, Card, IconButton, Avatar, Text, Chip } from "react-native-paper";

import { getDBConnection, saveLogItems, genLogKey } from '../db-service';
import { LogItem } from '../../models';
import * as SQLite from 'expo-sqlite';

export default function HomeScreen() {
  const [isLoad, setIsLoad] = React.useState(false);
  const [name, onChangeName] = React.useState('');
  const [voyn, onChangeVoyn] = React.useState('');
  const [time, setTime] = React.useState('');
  const [speedLAI, onChangeSpeedLAI] = React.useState('');
  const [speedMUI, onChangeSpeedMUI] = React.useState('');
  const [speedWind, onChangeSpeedWind] = React.useState('');
  const [distanceLAI, onChangeDistanceLAI] = React.useState('');
  const [distanceMUI, onChangeDistanceMUI] = React.useState('');
  const [db, setDB] = React.useState();

  const [data, setData] = React.useState({
    isVisible: false,
    time: {value: new Date().toLocaleString(), isWarning: false },
    speedLAI: {value: '', isWarning: false },
    speedMUI: {value: '', isWarning: false },
    speedWind: {value: '', isWarning: false },
    angleTau: {value: '', isWarning: false },
  });


  // const loadDataCallback = useCallback(async () => {
  //   try {
  //     console.log("Run history");
  //     const db = await getDBConnection();
  //     setDB()
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);

  // useEffect(() => {
  //   loadDataCallback();
  // }, [loadDataCallback]);

  const saveLog = async () => {
    try {
      const db = await getDBConnection();
      const key = genLogKey(voyn, time)
      
      // const dataTest: LogItem = {
      //   id: Date.now(),
      //   name: name,
      //   voyn: `${Date.now()}`,
      //   time: time,
      //   vtl: +`${+speedLAI + 0.00000000025659895}`.substring(0,18),
      //   vtm: +`${+speedMUI + 0.00000000025659895}`.substring(0,18),
      //   vtg: +`${+speedWind + 0.00000000025659895}`.substring(0,18),
      //   kcl: +`${+distanceLAI + 0.00000000025659895}`.substring(0,18),
      //   kcm: +`${+distanceMUI + 0.00000000025659895}`.substring(0,18),
      // }
      const item: LogItem = {
        id: Date.now(),
        name: "abc",
        voyn: voyn,
        time: new Date().toLocaleString(),
        vtl: parseFloat(speedLAI).toFixed(2), //+`${+speedLAI + 0.00000000025659895}`.substring(0,18), // Math.random() * 100,
        vtm: parseFloat(speedMUI).toFixed(2), //+`${+speedMUI + 0.00000000025659895}`.substring(0,18), //Math.random() * 100,
        vtg: parseFloat(speedWind).toFixed(2), // +`${+speedWind + 0.00000000025659895}`.substring(0,18), //Math.random() * 100,
        kcl: parseFloat(distanceLAI).toFixed(2), //+`${+distanceLAI + 0.00000000025659895}`.substring(0,18), //Math.random() * 100,
        kcm: parseFloat(distanceMUI).toFixed(2) //+`${+distanceMUI + 0.00000000025659895}`.substring(0,18) //Math.random() * 100,
      }
      /*
      save items 
 [{"id": 1722877502961, "kcl": 5.111111111256599, "kcm": 6.000000000256599, "name": "cffsf", "time": "8/6/2024, 12:05:00 AM", "voyn": "1722877502961", "vtg": 3.0000000002565987, "vtl": 2.0000000002565987, "vtm": 4.000000000256599}]
 LOG  save log 
 [{"id": 1722877502961, "kcl": 41.83918092784791, "kcm": 53.37214034886174, "name": "abc", "time": "8/6/2024, 12:05:02 AM", "voyn": "1722877502961", "vtg": 71.58822533781863, "vtl": 16.74193035011662, "vtm": 55.22811018891961}]
 LOG  INSERT OR REPLACE INTO datatable4 (rowid, name, voyn, time, vtl, vtm, vtg, kcl, kcm)  values(1722877502961, 'cffsf', '1722877502961', '8/6/2024, 12:05:00 AM', 2.0000000002565987, 4.000000000256599, 3.0000000002565987, 5.000000000256599, 6.000000000256599)
 */
      // console.log("save dataTest \n", [dataTest]);
      console.log("save _____log \n", [item]);
    
      await saveLogItems(db, [item]);
      // resetForm()
      return Alert.alert("Lưu kết quả thành công");
    } catch (error) {
      console.log("error", error);
      Alert.alert("Xảy ra lỗi trong quá trình lưu dữ liệu");
    }
   
  }

  const handleChange = (type: string, value: string) => {
    setData((p) => ({...p, ...{isVisible: false}}));

    switch (type) {
      case "name":
        onChangeName(value);
        break;
      case "VOYN":
        onChangeVoyn(value);
        break;
      case "LAI":
        onChangeSpeedLAI(value);
        break;
      case "MUI":
        onChangeSpeedMUI(value);
        break;
      case "Wind":
        onChangeSpeedWind(value);
        break;
      case "dLAI":
        onChangeDistanceLAI(value);
        break;
      case "dMUI":
        onChangeDistanceMUI(value);
        break;
      case "none":
          break;
    }
  }

  const resetForm = () => {
    setData((p) => ({...p, ...{isVisible: false}}));
    onChangeSpeedLAI('');
    onChangeSpeedMUI('');
    onChangeSpeedWind('');
    onChangeDistanceLAI('');
    onChangeDistanceMUI('');

  }
  const analyzeData = () => {
    if (!(speedLAI && speedMUI && speedWind && distanceLAI && distanceMUI)) {
      return Alert.alert("Vui lòng nhập tất cả số đo")
    }
    try {
      setIsLoad(true)
      const at ='' + (Math.atan((parseInt(distanceLAI)-parseInt(distanceMUI))/ 150) * (180 / Math.PI))
      const tg = new Date().toLocaleString()
      setTime(tg)
      setData({
        isVisible: true,
        time: {value: tg, isWarning: false },
        speedLAI: {value: speedLAI, isWarning: false},
        speedMUI: {value: speedMUI, isWarning: (parseFloat(speedMUI) > 8.0)? true : false },
        speedWind: {value: speedWind,  isWarning: (parseFloat(speedWind) > 6.0)? true : false },
        angleTau: {value: parseFloat(at).toFixed(2),  isWarning: (parseFloat(at) >10.0)? true : false},
      });
    } catch (error) {
      setIsLoad(false)
    }
    
    setTimeout(() => {
      setIsLoad(false)
    }, 1000)
  }

  return (
    <React.Fragment >
      <Text style={{marginTop: 20}}><React.Fragment></React.Fragment></Text>
      <Card style={{margin: 10}}>
        <Card.Content>
          <TextInput
            mode="outlined"
            label="Tên"
            value={name}
            onChangeText={text => handleChange("name", text)}
          />
          <TextInput
            mode="outlined"
            label="Voy No."
            value={voyn}
            onChangeText={text => handleChange("VOYN", text)}
          />
          <TextInput
            mode="outlined"
            label="Vận tốc lái (m/phút)"
            value={speedLAI}
            keyboardType='numeric'
            onChangeText={text => handleChange("LAI", text)}
          />
          <TextInput
            mode="outlined"
            label="Vận tốc mũi (m/phút)"
            value={speedMUI}
            keyboardType='numeric'
            onChangeText={text => handleChange("MUI", text)}
          />
          <TextInput
            mode="outlined"
            label="Vận tốc gió"
            value={speedWind}
            keyboardType='numeric'
            onChangeText={text => handleChange("Wind", text)}
          />
          <TextInput
            mode="outlined"
            label="Khoảng cách lái"
            value={distanceLAI}
            keyboardType='numeric'
            onChangeText={text => handleChange("dLAI", text)}
          />
          <TextInput
            mode="outlined"
            label="Khoảng cách mũi"
            value={distanceMUI}
            keyboardType='numeric'
            onChangeText={text => handleChange("dMUI", text)}
          />
        </Card.Content>
        <Card.Actions>
          <Button mode="outlined" onPress={resetForm}>Làm lại</Button>
          <Button loading={isLoad} icon="check-circle-outline" mode="contained" onPress={analyzeData}>
            Xác nhận 
          </Button>
        </Card.Actions>
      </Card>

      {data.isVisible  || true? <Card style={{margin: 10}}>
        <Card.Content>
          <Chip style={styles.listItem} {...(false)? {icon: "information"} : {}}>
            Thời gian đo:: {data.time.value}
          </Chip>
          <Chip style={styles.listItem} {...(false)? {icon: "information"} : {}}>
            Vận tốc lái (m/phút): {data.speedLAI.value}
          </Chip>
          <Chip style={(data.speedMUI.isWarning)? styles.listItemWarning : styles.listItem} {...(data.speedMUI.isWarning)? {icon: "alert"} : {}}>
            Vận tốc mũi (m/phút): {data.speedMUI.value}
          </Chip>
          <Chip style={(data.speedWind.isWarning)? styles.listItemWarning : styles.listItem} {...(data.speedWind.isWarning)? {icon: "alert"} : {}}>
            Vận tốc gió: {data.speedWind.value}
          </Chip>
          <Chip style={(data.angleTau.isWarning)? styles.listItemWarning : styles.listItem} {...(data.angleTau.isWarning)? {icon: 'alert'} : {}}>
            Góc cập tàu (Độ): {data.angleTau.value}
          </Chip>
        </Card.Content>
        <Card.Actions>
          <Button icon="content-save" mode="contained" onPress={saveLog}>
            Lưu kết quả đo
          </Button>
        </Card.Actions>
      </Card> : <React.Fragment></React.Fragment>}
      </React.Fragment>
  );
}


const styles = StyleSheet.create({
  listItem: {
    marginBottom: 5
  },
  listItemWarning: {
    marginBottom: 5,
    backgroundColor: "#FF8F00"
  }
});
