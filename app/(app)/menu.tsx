import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Text,
  ScrollView,
  View,
  RefreshControl,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import { useSessionContext } from "@/context/session-context";
import { router } from "expo-router";

export default function TabTwoScreen() {
  const [state, setState] = useState();
  const [refreshing, setRefreshing] = useState(true);
  const { session } = useSessionContext();
  async function fetchMenu() {
    if (!session) return router.replace("/sign-in");
    const parsedSession = JSON.parse(session);
    try {
      const response = await fetch("https://soal.staging.id/api/menu", {
        headers: {
          Authorization: `${parsedSession.token_type} ${parsedSession.access_token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          show_all: 1,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.result);
        setState(data.result);
      }
    } catch (error) {
      setState(undefined);
    } finally {
      setRefreshing(false);
    }
  }
  console.log(state);
  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: "#fff" }}
      refreshControl={
        <RefreshControl onRefresh={fetchMenu} refreshing={refreshing} />
      }
    >
      <ScrollView
        horizontal
        stickyHeaderHiddenOnScroll
        over
        style={styles.categories}
      >
        {state &&
          state.categories &&
          state.categories.map((item) => (
            <Pressable key={item.category_name} style={styles.category}>
              <Text>{item.category_name}</Text>
            </Pressable>
          ))}
      </ScrollView>
      <View style={{ marginTop: 24 }}>
        {state &&
          state.categories &&
          state.categories.map((item) => (
            <View key={item.category_name} style={{ paddingHorizontal: 24 }}>
              <Text>{item.category_name}</Text>
              {item.menu.map((menu) => (
                <View style={styles.menu}>
                  <View
                    style={{
                      width: 100,
                      height: 100,
                    }}
                  >
                    <Image
                      src={menu.photo}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </View>
                  <View>
                    <Text>{menu.name}</Text>
                    <Text style={{ fontSize: 12, color: "#686D76" }}>
                      {menu.description}
                    </Text>
                  </View>
                  <Text>{item.price}</Text>
                </View>
              ))}
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  categories: {
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  category: {
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  menu: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
});
