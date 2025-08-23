import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

import StockReplenishmentScreen from "./screens/StockReplenishmentScreen";
import MachineOperationScreen from "./screens/MachineOperationScreen";
import MachineTestingScreen from "./screens/MachineTestingScreen";
import MachineTransactionsScreen from "./screens/MachineTransactionsScreen";
import LoginScreen from "./screens/LoginScreen";

const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = checking, true/false = decided

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const session = await AsyncStorage.getItem("adminSession");
        if (session) {
          const { loggedIn, expiry } = JSON.parse(session);
          const now = Date.now();
          if (loggedIn && now < expiry) {
            setIsLoggedIn(true);
            return;
          } else {
            await AsyncStorage.removeItem("adminSession"); // expired
          }
        }
      } catch (error) {
        console.error("Error checking login:", error);
      }
      setIsLoggedIn(false);
    };

    checkLogin();
  }, []);

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("adminSession");
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) return null; // could add a splash screen here

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Drawer.Navigator initialRouteName="Stock Replenishment">
          <Drawer.Screen name="Stock Replenishment" component={StockReplenishmentScreen} />
          <Drawer.Screen name="Machine Operations" component={MachineOperationScreen} />
          <Drawer.Screen name="Machine Testing" component={MachineTestingScreen} />
          <Drawer.Screen name="Machine Transactions" component={MachineTransactionsScreen} />
          <Drawer.Screen
            name="Logout"
            component={() => null}
            listeners={{
              focus: handleLogout,
            }}
          />
        </Drawer.Navigator>
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </NavigationContainer>
  );
}
