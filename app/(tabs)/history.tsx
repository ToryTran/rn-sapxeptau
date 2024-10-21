import React, { useCallback, useEffect, useState,  type PropsWithChildren  } from 'react';
import { StyleSheet, Alert, ScrollView, View} from 'react-native';
import { Checkbox, Text, Card, Button, List, ActivityIndicator} from 'react-native-paper';
import { getDBConnection, getLogs, deleteLogItem } from '../db-service';
import {gocCapTau, genCSVDataString} from '../data-service'
import { LogItem } from '../../models';
import { useNavigation } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function TabTwoScreen() {
  const [checked, setChecked] = React.useState({});
  const [isSelectAll, setIsSelectAll] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [logs, setLogs] = useState<LogItem[]>([]);
  
  const navigation = useNavigation();

  let dbcon: any;

  const loadData = async () => {
    if (!dbcon) {
      dbcon = await getDBConnection()
    }
    try {
      setIsLoading(true)
      
      const logDataItems = await getLogs(dbcon);
      if (logDataItems.length) {
        setLogs(logDataItems);
      } 
    
      
    } catch (error) {
      console.error(error);
      return Alert.alert("Báo lỗi", `${error}` || "Xảy ra lỗi trong quá trình lấy dữ liệu");
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    setIsSelectAll(false)
    
    return unsubscribe;
    
  }, [navigation]);

  const handleCheck = (id: any) => {
    if (checked[id]) {
      setChecked(p => ({...p, [id]: !p[id]}))
    } else {
      setChecked(p => ({...p, [id]: true}))
    }
  }
  
  const checkAll = async () => {
    try {
      const check = {};
      await logs.map((e: LogItem) => {
        check[e.id] = !isSelectAll //checked[e.id] && !isSelectAll
      })
      setChecked(check)
      setIsSelectAll(p => !p)
    } catch (error) {
      Alert.alert("Error!!", `${error}`)
    }
   
  }
  
  
  const saveFile = async (data) => {

    let directoryUri = FileSystem.documentDirectory;
    
    let fileUri = directoryUri + `data_${Date.now()}.csv`;
    
    await FileSystem.writeAsStringAsync(fileUri, data, { encoding: FileSystem.EncodingType.UTF8 });
    
    return fileUri;
  };
    
  const shareFile = async (fileUri: any) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
    
    // Check if permission granted
    if (canShare) {
      try{
        const res = await Sharing.shareAsync(fileUri);
        console.log('shareAsync', res);
        return true;
      } catch {
        return false;
      }
    } else {
      Alert.alert("Vui lòng cấp phép chia sẻ cho ứng dụng")
    }
    } catch (error) {
      Alert.alert("Error!!", `${error}`)
    }
    
  };

  const downloadCSV = async () => {
  
    const file_uri = await saveFile(genCSVDataString(logs.filter(e => !!checked[e.id])))
    await shareFile(file_uri)
    await AsyncStorage.clear()
  }
  
  const deleteItems = async () => {
    try {
      const db = await getDBConnection();
      const deleteIds = logs.filter(e => !!checked[e.id]);
      for (let i = 0; i < deleteIds.length; i++) {
        await deleteLogItem(db, deleteIds[i].id);
      }
      setLogs(logs.filter(e => !checked[e.id]))
      return Alert.alert("Xoá thành công");
    } catch (error) {
      return Alert.alert("Báo lỗi", "Đã xảy ra lỗi trong quá trình xoá");
    }
    
  }

  const renderList = () => {
    try {
      console.log("test leng", logs.length);
      return logs.map((item, idx) => {
        // console.log(item);
        return <List.Accordion key={item.id}
        title={`Lần đo: ${item.time}`}
        // expanded={false}
        // onPress={() => setChecked(!checked)}
        onLongPress={() => handleCheck(item.id)}
        left={props => <Checkbox {...props}
          status={checked[item.id] ? 'checked' : 'unchecked'}
          // onPress={() => {
          //   setChecked(!checked);
          // }}
        />}>
            <List.Item title={`Vận tốc tàu (m/min): ${item.vtt}`} />
            <List.Item title={`Vận tốc gió (m/s): ${item.vtg}`} />
            <List.Item title={`Góc cập tàu (Độ): ${gocCapTau(item.kcl, item.kcm)}`} />
        </List.Accordion>
      });
    } catch (error) {
      return Alert.alert("Báo lỗi", "Lỗi xảy ra trong quá trình hiển thị");
    }
  }
  
 

  return (
    <View style={{ display: "flex", flex: 1, height: "100%" }}>
      <Text style={{marginTop: 20}}><React.Fragment></React.Fragment></Text>
      {isLoading ? <React.Fragment>
          <Text style={{marginTop: 50}}> Đang tải dữ liệu lên  </Text>
          <ActivityIndicator animating={true} size="large" color={"red"} /> 
        </React.Fragment> : <Card style={{ margin: 10, flex: 1 }}>
          <ScrollView>
          <Card.Content>
            <Checkbox.Item
              label='Chọn tất cả'
              status={isSelectAll ? 'checked' : 'unchecked'}
              onPress={checkAll}></Checkbox.Item>
            <List.Section title="">{renderList()}</List.Section>
          </Card.Content>
        </ScrollView>
        <Card.Actions>
        
          <Button mode="outlined" onPress={deleteItems}>
            Xoá
          </Button>
          <Button
            icon="file-export-outline"
            mode="contained"
            onPress={downloadCSV}
          >
            Xuất báo cáo
          </Button>
        </Card.Actions>
      </Card>}
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
