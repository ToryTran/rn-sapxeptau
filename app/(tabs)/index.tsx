import React, {useRef, useCallback, useEffect, useState,  type PropsWithChildren  } from 'react';
import { Alert, StyleSheet, View, ScrollView} from "react-native";
import { Button,TextInput, Card, IconButton, Avatar, Text, Chip } from "react-native-paper";
import {gocCapTau, cal_vtt} from '../data-service'
import { getDBConnection, saveLogItems, genLogKey } from '../db-service';
import { LogItem } from '../../models';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [isLoad, setIsLoad] = React.useState(false);
  const [name, onChangeName] = React.useState('');
  const [voyn, onChangeVoyn] = React.useState('');
  const [time, setTime] = React.useState('');
  const [kcd, onChangeKCD] = React.useState("0");
  const [speedTAU, onChangeSpeedTAU] = React.useState('');
  const [speedWind, onChangeSpeedWind] = React.useState('');
  const [distanceLAI, onChangeDistanceLAI] = React.useState('');
  const [distanceMUI, onChangeDistanceMUI] = React.useState('');
  const [db, setDb] = useState();

  const [data, setData] = React.useState({
    isVisible: false,
    time: {value: new Date().toLocaleString(), isWarning: false },
    speedTAU: {value: '', isWarning: false },
    speedWind: {value: '', isWarning: false },
    angleTau: {value: '', isWarning: false },
  });
  const connectDB = async () => {
    const dbcon = await getDBConnection();
    setDb(dbcon)
  }

  useEffect(() => {
    connectDB()
  }, [])

  const saveLog = async () => {
    try {
      
      const key = genLogKey(voyn, time)
      const kcd_value = parseFloat(kcd || "0")

      const item: LogItem = {
        id: key,
        name: name,
        voyn: voyn,
        time: new Date().toLocaleString().replace(',', ' '),
        vtt: speedTAU == "-" ? "-" : parseFloat(`${speedTAU}`).toFixed(2), 
        vtg: parseFloat(speedWind).toFixed(2), 
        kcl: Math.abs(parseFloat(distanceLAI) - kcd_value).toFixed(2),
        kcm: Math.abs(parseFloat(distanceMUI) - kcd_value).toFixed(2)
      }
      await AsyncStorage.setItem(
        `k_${name}_${voyn}`,
        JSON.stringify({...item, time: Date.now()}),
      );
      await saveLogItems(db, [item]);
      resetForm()
      return Alert.alert("Lưu kết quả thành công");
    } catch (error) {
      console.log("error", error);
      return Alert.alert("Xảy ra lỗi trong quá trình lưu dữ liệu");
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
      case "KCD":
        onChangeKCD(value);
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
    onChangeSpeedTAU('');
    onChangeSpeedWind('');
    onChangeDistanceLAI('');
    onChangeDistanceMUI('');

  }
  const analyzeData = async () => {
    if (!(speedWind && distanceLAI && distanceMUI)) {
      return Alert.alert("Vui lòng nhập tất cả số đo")
    }
    try {
      setIsLoad(true)
      const at = gocCapTau(distanceLAI, distanceMUI, kcd); //'' + (Math.atan((parseInt(distanceLAI)-parseInt(distanceMUI))/ 150) * (180 / Math.PI))
      const tg = new Date().toLocaleString();
      const key = `k_${name}_${voyn}`;
      // Alert.alert(`key : ${key}-----`);

      const prev_data = await AsyncStorage.getItem(key)
      // Alert.alert(`11111${prev_data}-----`);

      const vtt = cal_vtt(distanceMUI, Date.now(), prev_data, kcd)
      onChangeSpeedTAU(vtt)
      setTime(tg)
      setData({
        isVisible: true,
        time: {value: tg, isWarning: false },
        speedTAU: {value: vtt, isWarning: vtt == "-" ? false : (parseFloat(vtt) > 4.8)? true : false },
        speedWind: {value: speedWind,  isWarning: (parseFloat(speedWind) > 13.8)? true : false},
        angleTau: {value: parseFloat(at).toFixed(2),  isWarning: (parseFloat(at) >6.0)? true : false},
      });

    } catch (error) {
      setIsLoad(false)
    }
    
    setTimeout(() => {
      setIsLoad(false)
    }, 1000)
  }

  return (
    <View style={{ display: "flex", flex: 1, height: "100%" }}>
      <ScrollView
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
        ref={scrollViewRef}
      >
      <Text style={{marginTop: 20}}><React.Fragment></React.Fragment></Text>
      <Card style={{margin: 10}}>
        <Card.Content>
          <TextInput
            mode="outlined"
            label="Tên tàu"
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
            label="Khoảng cách đo (met)"
            value={kcd}
            keyboardType='numeric'
            onChangeText={text => handleChange("KCD", text)}
          />
          <TextInput
            mode="outlined"
            label="Vận tốc gió (m/s)"
            value={speedWind}
            keyboardType='numeric'
            onChangeText={text => handleChange("Wind", text)}
          />
          <TextInput
            mode="outlined"
            label="Khoảng cách lái (m)"
            value={distanceLAI}
            keyboardType='numeric'
            onChangeText={text => handleChange("dLAI", text)}
          />
          <TextInput
            mode="outlined"
            label="Khoảng cách mũi (m)"
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

      {data.isVisible ? <Card style={{marginTop:5, marginLeft: 10, marginRight: 10}}>
        <Card.Content>
          <Chip style={styles.listItem} {...(false)? {icon: "information"} : {}}>
            Thời gian đo:: {data.time.value}
          </Chip>
          <Chip style={(data.speedTAU.isWarning)? styles.listItemWarning : styles.listItem} {...(data.speedTAU.isWarning)? {icon: "alert"} : {}}>
            Vận tốc tàu (m/min): {data.speedTAU.value} - {(data.speedTAU.isWarning)? "CẢNH BÁO" : "BÌNH THƯỜNG"}
          </Chip>
          <Chip style={(data.speedWind.isWarning)? styles.listItemWarning : styles.listItem} {...(data.speedWind.isWarning)? {icon: "alert"} : {}}>
            Vận tốc gió (m/s): {data.speedWind.value} - {(data.speedWind.isWarning)? "CẢNH BÁO" : "BÌNH THƯỜNG"}
          </Chip>
          <Chip style={(data.angleTau.isWarning)? styles.listItemWarning : styles.listItem} {...(data.angleTau.isWarning)? {icon: 'alert'} : {}}>
            Góc cập tàu (°): {data.angleTau.value} - {(data.angleTau.isWarning)? "CẢNH BÁO" : "BÌNH THƯỜNG"}
          </Chip>
        </Card.Content>
        <Card.Actions>
          <Button icon="content-save" mode="contained" onPress={saveLog}>
            Lưu kết quả đo
          </Button>
        </Card.Actions>
      </Card> : <React.Fragment></React.Fragment>}
      </ScrollView>
    </View>
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
