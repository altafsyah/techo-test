import { Redirect, Tabs } from "expo-router";
import React, { useEffect } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSessionContext } from "@/context/session-context";
import { Stack } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { session } = useSessionContext();

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="menu"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          title: "Menu",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "menu" : "menu-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
