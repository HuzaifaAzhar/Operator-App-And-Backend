import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StockReplenishment from './screens/StockReplenishment';
import MachineOperationTesting from './screens/MachineOperationTesting';
import MonitoringOps from './screens/MonitoringOps';
// Import other screens...

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="StockReplenishment">
        <Drawer.Screen name="Stock Replenishment" component={StockReplenishment} />
        <Drawer.Screen name="Machine Operation Testing" component={MachineOperationTesting} />
        <Drawer.Screen name="Monitoring OPS" component={MonitoringOps} />
        {/* Add other screens here */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
