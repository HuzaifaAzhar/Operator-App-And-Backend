import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StockReplenishment from './screens/StockReplenishment';
import MachineOperationTesting from './screens/MachineOperationTesting';
import MonitoringOps from './screens/MonitoringOps';
import StockReplenishmentScreen from './screens/StockReplenishmentScreen';
import MachineTestingScreen from './screens/MachineTestingScreen';
import MachineOperationScreen from './screens/MachineOperationScreen';
import MachineTransactionsScreen from './screens/MachineTransactionsScreen';
// Import other screens...
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="StockReplenishment">
        {/* <Drawer.Screen name="Stock Replenishment" component={StockReplenishment} />
        <Drawer.Screen name="Machine Operation Testing" component={MachineOperationTesting} />
        <Drawer.Screen name="Monitoring OPS" component={MonitoringOps} /> */}
        <Drawer.Screen name="Stock Replenishment Screen" component={StockReplenishmentScreen} />
        <Drawer.Screen name="Machine Testing Screen" component={MachineTestingScreen} />
        <Drawer.Screen name="Machine Operation Screen" component={MachineOperationScreen} />
        <Drawer.Screen name="Machine Transactions Screen" component={MachineTransactionsScreen} />
        {/* Add other screens here */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
