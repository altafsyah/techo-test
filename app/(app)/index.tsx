import { useSessionContext } from "@/context/session-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Text,
  Pressable,
  RefreshControl,
} from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

interface HomeData {
  greeting?: string;
  name?: string;
  saldo?: number;
  point?: number;
  qrcode?: string;
  banner?: string[];
}

export default function HomeScreen() {
  const [state, setState] = useState<HomeData | null>({});
  const [fetching, setFetching] = useState(true);

  const { session } = useSessionContext();

  async function fetchHomeData() {
    if (!session) return router.replace("/sign-in");

    const sessionParsed = JSON.parse(session);

    try {
      const response = await fetch("https://soal.staging.id/api/home", {
        headers: {
          Authorization: `${sessionParsed.token_type} ${sessionParsed.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setState(data.result);
      }
      setFetching(false);
    } catch (error) {
      console.log(error);
      setFetching(false);
    }
  }

  useEffect(() => {
    try {
      fetchHomeData();
    } catch (error) {
      setState(null);
    }
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        style={{ height: Dimensions.get("window").height }}
        refreshControl={
          <RefreshControl
            onRefresh={fetchHomeData}
            refreshing={fetching}
          ></RefreshControl>
        }
      >
        <View style={[styles.container, { height: 100 }]}>
          <View style={{ width: 180, height: "100%" }}>
            <Image
              source={require("@/assets/images/logo technopartner.png")}
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.userCard}>
            <Text>{state ? state.greeting : ""}</Text>
            <Text>{state ? state.name : ""}</Text>
            <View style={styles.userStats}>
              <Pressable style={styles.qrcode}>
                <Ionicons name="qr-code" size={32} />
              </Pressable>
              <View
                style={{
                  // width: 1,
                  height: "60%",
                  borderColor: "#000",
                  borderWidth: 0.2,
                  borderStyle: "dashed",
                }}
              />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.userCredit}>
                  <Text>Saldo</Text>
                  <Text>{state?.saldo ?? 0}</Text>
                </View>
                <View style={styles.userCredit}>
                  <Text>Points</Text>
                  <Text>{state?.point ?? 0}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <PagerView style={styles.bannerContainer}>
          {state?.banner &&
            state.banner.map((banner) => (
              <View style={styles.banner} key={banner}>
                <Image
                  src="https://soal.staging.id/img/banner-app-750x375-hitam.png"
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
            ))}
        </PagerView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    width: Dimensions.get("window").width,
    position: "relative",
  },
  userCard: {
    padding: 24,
    width: "100%",
    backgroundColor: "#fff",
    elevation: 1,
    height: "auto",
    borderRadius: 8,
  },
  userStats: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 24,
  },
  userCredit: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qrcode: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    elevation: 2,
    backgroundColor: "#fff",
    borderRadius: 100,
  },
  bannerContainer: {
    backgroundColor: "#000",
    width: Dimensions.get("window").width,
    height: 200,
    marginTop: 40,
  },
  banner: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
});
