import React, { useCallback, useEffect, useState,  type PropsWithChildren  } from 'react';
import { StyleSheet, Alert, ScrollView, navig} from 'react-native';
import { Checkbox, Text, Card, Button, List } from 'react-native-paper';
import { getDBConnection, getLogs, deleteLogItem } from '../db-service';
import { LogItem } from '../../models';
import { Stack, useNavigation } from 'expo-router';

export default function TabTwoScreen() {
  const [checked, setChecked] = React.useState({});
  const [logs, setLogs] = useState<LogItem[]>([]);
  const navigation = useNavigation();
  console.log("TabTwoScreen, ", Date.now());

  const loadData = async () => {
    try {
      console.log("Run history");
      const db = await getDBConnection();
      const logDataItems = await getLogs(db);
      if (logDataItems.length) {
        setLogs(logDataItems);
      } 
      if (logDataItems.length > 10 ) {
        for (let i = 5; i< logDataItems.length; i++)
          deleteLogItem(db, logDataItems[i].id);
      } 
      
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      loadData();
    });

    return unsubscribe;
    
  }, [navigation]);

  const handleCheck = (id: any) => {
    if (checked[id]) {
      setChecked(p => ({...p, [id]: !p[id]}))
    } else {
      setChecked(p => ({...p, [id]: true}))
    }
  }

  const renderList = () => {
    console.log("test leng", logs.length);
    return logs.map((item, idx) => {
      return <List.Accordion key={item.id}
      title={`item ${idx + 1} - ${item.id}`}
      // expanded={false}
      // onPress={() => setChecked(!checked)}
      onLongPress={() => handleCheck(item.id)}
      left={props => <Checkbox {...props}
        status={checked[item.id] ? 'checked' : 'unchecked'}
        // onPress={() => {
        //   setChecked(!checked);
        // }}
      />}>
          <List.Item title="First item" />
          <List.Item title="Second item" />
      </List.Accordion>
    })

    // const historyList = []
    // for (let i = 1; i<15; i++) {
    //   historyList.push(
    //   <List.Accordion key={i}
    //     title={`item ${i}`}
    //     left={props => <List.Icon {...props} icon="folder" />}>
    //     <List.Item title="First item" />
    //     <List.Item title="Second item" />
    // </List.Accordion>)
    // }
    // return historyList
  }
  
  return (
    <React.Fragment>
      <Text style={{marginTop: 20}}>{""}</Text>
      <Card style={{margin: 10}}>
        <ScrollView>
          <Card.Content>
            <List.Section title="Accordions">
              { renderList()}
            </List.Section>
          </Card.Content>
        </ScrollView>
          <Card.Actions>
            <Button mode="outlined" onPress={() => Alert.alert("reset")}>Clear</Button>
            <Button icon="file-export-outline" mode="contained" onPress={() => Alert.alert('export')}>
              Xuất báo cáo
            </Button>
          </Card.Actions>
      </Card>
    </React.Fragment>
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
